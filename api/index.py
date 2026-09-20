import sys
import os

# Add the root directory to the python path so 'backend' can be resolved
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.main import app

# Vercel relies on the 'app' variable to execute the ASGI FastAPI server
