from app import create_app
import os
import sys

# Add current directory to Python path
# it's me I guess
# sys.path.insert(0, os.path.dirname(__file__))

app = create_app()

if __name__ == '__main__':
    app.run()