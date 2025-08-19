from datetime import datetime
from typing import List, Dict, Any
from models import FlexibleModel, BanishableMixin, Fields
from bson import ObjectId


class Message(FlexibleModel):
    """Message class"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.contents = kwargs.get("contents", "Recent chat")


class Chat(BanishableMixin, FlexibleModel):
    """Chat Class"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.name = kwargs.get("name", "Recent chat")

        # Embedded tasks
        self.messages: List[Message] = [
            Message(**task) for task in kwargs.get("messages", [])
        ]

    def __repr__(self):
        return f"{self.name}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to MongoDB document format"""
        base_dict = super().to_dict()
        if "messages" in base_dict:
            base_dict["messages"] = [message.to_dict() for message in self.messages]
        return base_dict
