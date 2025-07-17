from flask import Blueprint, jsonify, request
from shared.db import Table
from shared.logger import logger
import asyncio
from flask import Flask, Blueprint, request, jsonify
import ollama
from fastmcp import Client

# Standard Blueprint
bp = Blueprint("app", __name__, url_prefix="/")

# @bp.route("/health/", methods=["GET"])
# def health():
#     """
#     Return health for app.
#     """
#     logger.info("Received request to check the health endpoint")
#     # TODO: Check mongo health
#     return jsonify({"status": "healthy"})

# @bp.route("/meta/", methods=["GET"])
# def get_meta():
#     """
#     Get meta data of the application.
#     """
#     logger.info("Received request to query the meta")

#     meta = {
#         "alert_count": Table.ALERT.count(),
#         "todo_count": Table.TODO.count(),
#     }

#     logger.info("Successfully generated meta data.")
#     return jsonify(meta)


# @bp.route("/notebook/", methods=["GET"])
# def get_notebook():
#     """
#     Get the jupyter notebook for this.
#     """
#     # Read the notebook
#     with open("notebook", "r", encoding="utf-8") as f:
#         notebook_content = nbformat.read(f, as_version=4)

#     # Convert the notebook to HTML
#     html_exporter = HTMLExporter()
#     html_exporter.template_name = "classic"
#     (body, _) = html_exporter.from_notebook_node(notebook_content)

#     # Serve the HTML
#     return body

MODEL = "llama3.2:3b"  # Use a model that supports tool calling, e.g., llama3.1:8b
MCP_URL = "http://127.0.0.1:8000/mcp/"


async def get_ollama_tools():
    async with Client(MCP_URL) as client:
        tools = await client.list_tools()
        ollama_tools = []
        for tool in tools:
            ollama_tools.append({
                "type": "function",
                "function": {
                    "name": tool.name,
                    "description": tool.description,  # Assumes Tool has .description (from docstring)
                    "parameters": tool.inputSchema  # Corrected to use .input_schema for JSON schema dict
                }
            })
        return ollama_tools

async def call_tool_async(tool_name: str, args: dict):
    async with Client(MCP_URL) as client:
        result = await client.call_tool(tool_name, args)
        print("--------")
        print("TOOL CALL")
        print(result.content[0].text)
        print("--------")
        return result.content[0].text

@bp.route('/chat/', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Add system prompt to guide parameter gathering
    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful assistant that uses tools only when all required parameters are clearly available from the user's message or conversation context. "
                "For the 'Create a todo' tool, it requires 'description' (a string describing the todo) and 'due_on' (a date in YYYY-MM-DD format). "
                "If either is missing or unclear, do NOT call the tool. Instead, ask the user for the missing information in your response. "
                "Do not hallucinate or assume values—always clarify first. Once you have both, call the tool with the exact values."
            )
        },
        {"role": "user", "content": user_message}
    ]
    
    ollama_tools = asyncio.run(get_ollama_tools())
    
    while True:
        response = ollama.chat(
            model=MODEL,
            messages=messages,
            tools=ollama_tools
        )
        assistant_message = response['message']
        if 'tool_calls' not in assistant_message:
            return jsonify({"content": assistant_message['content']})

        messages.append(assistant_message)

        for tool_call in assistant_message['tool_calls']:
            tool_name = tool_call['function']['name']
            args = tool_call['function']['arguments']
            tool_result = asyncio.run(call_tool_async(tool_name, args))
            messages.append({
                "role": "tool",
                "name": tool_name,
                "content": str(tool_result)
            })
