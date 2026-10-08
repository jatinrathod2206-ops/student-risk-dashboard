import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, '..', '..'))
for d in [project_root, os.path.join(project_root, 'ml'), os.path.join(project_root, 'backend')]:
    if d not in sys.path:
        sys.path.insert(0, d)

import uvicorn
from app.main import app

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
