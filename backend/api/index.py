import sys
import os
import types

_api_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.dirname(_api_dir)
_root_dir = os.path.dirname(_backend_dir)

for p in [_backend_dir, _root_dir]:
    if p not in sys.path:
        sys.path.insert(0, p)

if "backend" not in sys.modules:
    _pkg = types.ModuleType("backend")
    _pkg.__path__ = [_backend_dir]
    sys.modules["backend"] = _pkg

from backend.main import app

__all__ = ["app"]
