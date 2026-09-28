import httpx
import json
import logging
from typing import Optional
from .llm_provider import LLMProvider
from ..config import settings

logger = logging.getLogger(__name__)

class GptOssProvider(LLMProvider):
    """
    Hosted open-model alternative (e.g. Groq, OpenRouter, or OpenAI-compatible provider).
    Used as an open-model fallback or comparison model.
    """
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
    ):
        self.api_key = api_key or settings.GPT_OSS_API_KEY
        self.base_url = (base_url or settings.GPT_OSS_BASE_URL).rstrip("/")
        self.model = model or settings.GPT_OSS_MODEL

    @property
    def provider_name(self) -> str:
        return "gpt_oss"

    @property
    def model_name(self) -> str:
        return self.model

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        json_output: bool = False,
        temperature: float = 0.2,
    ) -> str:
        if not self.is_configured():
            raise ValueError("GPT_OSS_API_KEY is not set or invalid.")

        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
        }

        if json_output:
            payload["response_format"] = {"type": "json_object"}

        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            if response.status_code != 200:
                logger.error(f"GPT-OSS API error {response.status_code}: {response.text}")
                response.raise_for_status()

            data = response.json()
            return data["choices"][0]["message"]["content"]
