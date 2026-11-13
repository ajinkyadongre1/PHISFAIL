import sys
import os
import types

_api_dir = os.path.dirname(os.path.abspath(__file__))
_root_dir = os.path.dirname(_api_dir)

for p in [_api_dir, _root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

# Map backend namespace to local api dir if running standalone in Vercel api project
if "backend" not in sys.modules:
    _pkg = types.ModuleType("backend")
    _pkg.__path__ = [_api_dir]
    sys.modules["backend"] = _pkg

# Import app from local main
from main import app

__all__ = ["app"]
