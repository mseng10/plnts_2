import asyncio
import ollama

from typing import Dict, Any
from fastmcp import Client

MODEL = "gpt-oss:20b"  # Use a model that supports tool calling, e.g., gpt-oss:20b
MCP_URL = "http://127.0.0.1:8000/mcp/"


async def get_ollama_tools():
    async with Client(MCP_URL) as client:
        tools = await client.list_tools()
        ollama_tools = []
        for tool in tools:
            ollama_tools.append(
                {
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,  # Assumes Tool has .description (from docstring)
                        "parameters": tool.inputSchema,  # Corrected to use .input_schema for JSON schema dict
                    },
                }
            )
        return ollama_tools


async def call_tool_async(tool_name: str, args: dict):
    async with Client(MCP_URL) as client:
        result = await client.call_tool(tool_name, args)
        return result.content[0].text


def message(user_message: str) -> Dict[str, Any]:
    # Add system prompt to guide parameter gathering
    # TODO: Update
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant that uses tools only when all required parameters are clearly available from the user's message or conversation context. "
                "For the 'Create a todo' tool, it requires 'description' (a string describing the todo) and 'due_on' (a date in YYYY-MM-DD format). "
                "If either is missing or unclear, do NOT call the tool. Instead, ask the user for the missing information in your response. "
                "Do not hallucinate or assume values—always clarify first. Once you have both, call the tool with the exact values."
            ),
        },
        {"role": "user", "content": user_message},
    ]

    ollama_tools = asyncio.run(get_ollama_tools())

    while True:
        response = ollama.chat(model=MODEL, messages=messages, tools=ollama_tools)
        assistant_message = response["message"]
        if "tool_calls" not in assistant_message:
            return assistant_message["content"]

        messages.append(assistant_message)

        for tool_call in assistant_message["tool_calls"]:
            tool_name = tool_call["function"]["name"]
            args = tool_call["function"]["arguments"]
            tool_result = asyncio.run(call_tool_async(tool_name, args))
            messages.append(
                {"role": "tool", "name": tool_name, "content": str(tool_result)}
            )
