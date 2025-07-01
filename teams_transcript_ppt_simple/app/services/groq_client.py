# import requests

# def get_key_points(content: str, custom_prompt: str) -> list[str]:
#     """
#     Sends the custom prompt and transcript content to Ollama
#     and returns the extracted key points as a list of strings.
#     """
#     # Construct the full prompt to send to the LLM
#     prompt = f"{custom_prompt}\n\nTranscript:\n{content}"
    
#     try:
#         response = requests.post(
#             "http://localhost:11434/api/generate",
#             json={
#                 "model": "llama3",
#                 "prompt": prompt,
#                 "stream": False
#             }
#         )
#         response.raise_for_status()
#     except requests.RequestException as e:
#         raise RuntimeError(f"Ollama API call failed: {e}")

#     # Extract plain text response
#     output_text = response.json().get("response", "").strip()

#     # Split into bullet points or lines (customize based on LLM format)
#     key_points = [line.strip("-• \n") for line in output_text.splitlines() if line.strip()]
#     return key_points

# import requests
# import time
# import random

# GROQ_API_KEY = "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"

# def handle_rate_limit(attempt, max_retries=3):
#     if attempt >= max_retries:
#         raise Exception("Max retries exceeded for rate limit.")
#     delay = (1 * 2 ** attempt) + random.uniform(0, 0.1)
#     time.sleep(delay)

# def get_llm_response(prompt, content):
#     full_prompt = f"{prompt}\n\nRaw Text Content:\n{content}"
#     max_retries = 3

#     for attempt in range(max_retries):
#         try:
#             response = requests.post(
#                 "https://api.groq.com/openai/v1/chat/completions",
#                 headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
#                 json={
#                     "model": "llama3-8b-8192",
#                     "messages": [
#                         {"role": "system", "content": "You are Groq, a professional AI assistant created by xAI."},
#                         {"role": "user", "content": full_prompt}
#                     ],
#                     "max_tokens": 1000,
#                     "temperature": 0.7
#                 }
#             )
#             response.raise_for_status()
#             return response.json()["choices"][0]["message"]["content"]

#         except requests.HTTPError as e:
#             if e.response.status_code == 429:
#                 handle_rate_limit(attempt)
#             elif e.response.status_code == 401:
#                 raise Exception("Authentication error: Invalid Groq API key.")
#             else:
#                 raise
#         except Exception as e:
#             raise Exception(f"Unexpected error: {str(e)}")

#     raise Exception("Max retries exceeded.")

import requests
from openai import OpenAI


GROQ_API_KEY = "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

def get_llm_response(prompt, content):
    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"{prompt}\n\n{content}"}
        ],
        "max_tokens": 1000,
        "temperature": 0.7
    }

    response = requests.post(GROQ_API_URL, json=payload, headers=HEADERS)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

def ppt_llm(prompt):
    client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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",
    )
    ai_output = None
    completion = client.chat.completions.create(
        model="x-ai/grok-3-mini",
        messages=[
            {"role": "system", "content": "You are Grok, a professional AI assistant created by xAI."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=3000,
        temperature=0.7,
    )
    ai_output = completion.choices[0].message.content
    if ai_output:
        return ai_output
    else:
        return "No content response"


