"""
Module for chat related models.
"""
from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import Field, model_validator
from models import FlexibleModel


class Message(FlexibleModel):
    """Message model."""
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    contents: Optional[str] = None


class Chat(FlexibleModel):
    """Chat model with embedded messages."""
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    name: Optional[str] = None
    messages: List[Message] = Field(default_factory=list)

    @model_validator(mode='before')
    @classmethod
    def process_embedded_messages(cls, values):
        """Convert message dictionaries to Message instances if needed"""
        if isinstance(values, dict) and 'messages' in values:
            messages = values['messages']
            if messages and isinstance(messages[0], dict):
                values['messages'] = [Message.model_validate(msg) for msg in messages]
        return values

    def __repr__(self):
        return f"{self.name or 'Unnamed Chat'}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to MongoDB document format"""
        base_dict = super().to_dict()
        if self.messages:
            base_dict["messages"] = [message.to_dict() for message in self.messages]
        return base_dict