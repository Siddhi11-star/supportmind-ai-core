from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class LLMProvider(ABC):
    """
    Abstract interface for LLM Providers.
    Allows seamlessly switching between Google Gemini, GPT-OSS (Groq), or fallbacks.
    """
    @property
    @abstractmethod
    def provider_name(self) -> str:
        pass

    @property
    @abstractmethod
    def model_name(self) -> str:
        pass

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        json_output: bool = False,
        temperature: float = 0.2,
    ) -> str:
        """Generate text or JSON completion from prompt."""
        pass
