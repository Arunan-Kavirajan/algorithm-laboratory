from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

app = FastAPI(title="Algorithm Laboratory API")

# Configure CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
@app.head("/api/health")
def health_check():
    return {"status": "ok", "time": time.time()}

from .api import execution

# Include routers here later
app.include_router(execution.router, prefix="/api")

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Define the absolute path to the frontend dist folder
dist_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")

# Only mount the static files if the dist folder exists (so local dev doesn't crash)
if os.path.isdir(dist_path):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_path, "assets")), name="assets")
    
    # Catch-all route to serve the SPA index.html for any other route
    @app.get("/{catchall:path}")
    @app.head("/{catchall:path}")
    def serve_react_app(catchall: str):
        file_path = os.path.join(dist_path, catchall)
        if catchall and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_path, "index.html"))
