import requests
from io import StringIO
import sys
from fastmcp import FastMCP
from shared.logger import logger

mcp = FastMCP(name="MCP Tools Server")


@mcp.tool("Say Hello")
def say_hello() -> str:
    """Tell the user hello and nothing else."""
    try:
        logger.info("MCP Tool call to say hello")
        return "hello"
    except Exception as e:
        return f"Error fetching endpoint: {str(e)}"


@mcp.tool("Returns a list of todos")
def list_todos():
    """Returns the full unfiltered list of all todos as JSON. This tool does NOT accept any arguments or filters (e.g., no date parameter). If filtering is needed (like for today: 2025-07-16), retrieve the full list first and process it yourself in a follow-up response.

    Each todo is a dictionary with keys like 'task' and 'due date' (YYYY-MM-DD)."""
    logger.info("Got a call to query all todos")
    response = requests.get("http://localhost:8002/todos/")
    return (response.json())


@mcp.tool("Create a todo")
def create_todo(name: str, due_on: str):
    """Create a new todo. Requires 'name' (todo details) and 'due_on' (YYYY-MM-DD). Do not call unless both are provided explicitly."""
    try:
        # Map to Todo model fields; assuming 'description' goes to Todo.description, and optionally set name if needed
        todo_data = {
            "name": name,
            "due_on": due_on,
            # Add other fields if required, e.g., "name": description[:50] for a short name, "tasks": []
        }
        response = requests.post("http://localhost:8002/todos/", json=todo_data)
        response.raise_for_status()  # Raise if not 200-299
        return response.json()  # Return the created todo from the API
    except Exception as e:
        return f"Error creating todo: {str(e)}"


if __name__ == "__main__":
    mcp.run(transport="http", port=8000)
