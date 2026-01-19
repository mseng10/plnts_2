import os
from flask import Blueprint, request, jsonify
from routes import GenericCRUD, APIBuilder
from shared.logger import logger
from shared.db import Table
from models.chat import Chat, Message
from shared.mcp_client import message

chat_bp = Blueprint("chat", __name__)
chat_crud = GenericCRUD(Table.CHAT)
APIBuilder.register_blueprint(chat_bp, "chat", chat_crud, ["GET", "GET_MANY", "POST"])


def get_dummy_response(user_message: str) -> str:
    """Generate a generic dummy response when MCP client is disabled"""
    responses = [
        "That's interesting! Tell me more.",
        "I understand. How can I help you with that?",
        "Thanks for sharing that with me.",
        "I see what you mean.",
        "Let me think about that for a moment."
    ]
    # Simple hash-based selection for variety
    idx = hash(user_message) % len(responses)
    return responses[idx]


@APIBuilder.register_custom_route(
    chat_bp, "/chat/<string:id>/message/", methods=["POST"]
)
def chat(id: str):
    logger.info("Initializing chat with user")
    chat: Chat = Table.CHAT.get_one(id)
    if chat is None:
        logger.error(f"Chat {id} does not exist")
        return jsonify({"error": "Chat does not exist"}), 400

    data = request.json
    user_content: str = data.get("message")
    if not user_content:
        logger.error("No message provided")
        return jsonify({"error": "No message provided"}), 400

    # Append new message to history
    user_message: Message = Message(contents=user_content)
    chat.messages.append(user_message)

    # Post this message to the client or use dummy response
    if os.getenv("MCP_CLIENT"):
        response_content = message(user_message.contents)
    else:
        response_content = get_dummy_response(user_message.contents)
        logger.info("MCP_CLIENT not set, using dummy response")

    # Append LL response
    response_message: Message = Message(contents=response_content)
    chat.messages.append(response_message)

    # Update the table and return the result
    Table.CHAT.update(id, chat)
    updated_chat: Chat = Table.CHAT.get_one(id)

    return jsonify({"content": updated_chat.messages[-1].contents})


@APIBuilder.register_custom_route(
    chat_bp, "/chat/greeting/", methods=["GET"]
)
def greeting():
    """Generate a greeting"""
    logger.info("Creating greeting for user")

    if os.getenv("MCP_CLIENT"):
        response_content = message("create a short 3-5 word greeting (my name is tush). Keep it kinda gangster and fun. No period. make it plant themed once in awhile")
    else:
        # Generic greetings when MCP client is disabled
        greetings = [
            "Hey Tush what's good",
            "Yo Tush let's go",
            "What's up Tush",
            "Tush in the building",
            "Sup Tush ready to grow"
        ]
        import random
        response_content = random.choice(greetings)
        logger.info("MCP_CLIENT not set, using dummy greeting")

    return jsonify({"message": response_content})