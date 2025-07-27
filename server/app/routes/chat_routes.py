from flask import Blueprint, request, jsonify
from routes import GenericCRUD, APIBuilder, Schema
from shared.logger import logger
from shared.db import Table
from models.chat import Chat, Message
from shared.mcp_client import message

chat_bp = Blueprint("chat", __name__)
chat_crud = GenericCRUD(Table.CHAT, Schema.CHAT)
APIBuilder.register_blueprint(chat_bp, "chat", chat_crud, ["GET", "GET_MANY", "POST"])


@APIBuilder.register_custom_route(
    chat_bp, "/chat/<string:id>/message", methods=["POST"]
)
def chat(id: str):
    logger.info("Initializing chat with user")

    chat: Chat = Table.CHAT.get_one(id)
    if chat is None:
        logger.error(f"Chat {id} does not exist")
        return jsonify({"error": "Chat does not exist"}), 400

    data = request.json
    user_content: str = data.get("message")
    if not user_message:
        logger.error(f"No message provided")
        return jsonify({"error": "No message provided"}), 400

    # Append new message to history
    user_message: Message = Message(contents=user_content)
    chat.messages.append(user_message)

    # Post this message to the client
    response_message = message(user_message.contents)

    # Append LL response
    response_message: Message = Message(contents=response_message["content"])
    chat.messages.append(response_message)

    # Update the table and return the result
    Table.CHAT.update(id, chat)
    return jsonify({"content": Table.CHAT.get_one(id)["messages"][-1]})  # Don't love
