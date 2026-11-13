import os
import sys

# Ensure root directory is on the Python path for Vercel Serverless environment
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.main import app

# Export app for Vercel ASGI serverless handler
__all__ = ["app"]
