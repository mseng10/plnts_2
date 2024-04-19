class Config:
    """Configuration for this process."""

    def __init__(self, test_mode: bool) -> None:
        self.test_mode: bool = test_mode

    def __repr__(self):
        return "Configuration:\n" + f" - Test Mode: {self.test_mode}"
