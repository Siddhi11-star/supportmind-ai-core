import httpx
import json
import logging
from typing import Optional, List
from .llm_provider import LLMProvider
from ..config import settings

logger = logging.getLogger(__name__)

class GeminiProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"

    @property
    def provider_name(self) -> str:
        return "gemini"

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
            raise ValueError("GEMINI_API_KEY is not set or invalid.")

        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "temperature": temperature,
            },
        }

        if system_prompt:
            payload["systemInstruction"] = {
                "parts": [{"text": system_prompt}]
            }

        if json_output:
            payload["generationConfig"]["responseMimeType"] = "application/json"

        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code != 200:
                logger.error(f"Gemini API error {response.status_code}: {response.text}")
                response.raise_for_status()
            
            data = response.json()
            try:
                candidate = data["candidates"][0]
                text = candidate["content"]["parts"][0]["text"]
                return text
            except (KeyError, IndexError) as e:
                logger.error(f"Malformed Gemini response: {data}")
                raise RuntimeError(f"Unexpected response structure from Gemini API: {e}")

    async def get_embedding(self, text: str) -> List[float]:
        if not self.is_configured():
            raise ValueError("GEMINI_API_KEY is not set.")

        url = f"{self.base_url}/models/{settings.GEMINI_EMBEDDING_MODEL}:embedContent?key={self.api_key}"
        payload = {
            "model": f"models/{settings.GEMINI_EMBEDDING_MODEL}",
            "content": {
                "parts": [{"text": text[:2000]}]
            }
        }
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["embedding"]["values"]
