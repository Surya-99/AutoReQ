# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.api.routes import router

# app = FastAPI(
#     title="Transcript to PowerPoint Generator",
#     description="Upload a Teams transcript and generate a PowerPoint with summarized key points using Ollama.",
#     version="1.0.0"
# )

# # Enable CORS (especially helpful if you have a frontend)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # Replace with frontend URL in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Include the main API router
# app.include_router(router, prefix="/api")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="Transcript AI Processor",
    description="Upload a .txt or .docx file and generate Summary, Notes, or PPT content using Groq.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

