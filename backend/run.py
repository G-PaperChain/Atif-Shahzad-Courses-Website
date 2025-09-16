# #!/usr/bin/env python3
# import os
# import sys
# import logging
# from logging.handlers import RotatingFileHandler

# # Add the current directory to Python path
# sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Create logs directory if it doesn't exist
# log_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
# os.makedirs(log_dir, exist_ok=True)

# # Set up file handler
# file_handler = RotatingFileHandler(
#     os.path.join(log_dir, 'app.log'),
#     maxBytes=10240000,  # 10MB
#     backupCount=5
# )
# file_handler.setFormatter(logging.Formatter(
#     '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
# ))
# file_handler.setLevel(logging.INFO)
# logger.addHandler(file_handler)

# logger.info('Starting Flask application...')

# try:
#     from app import create_app, db
#     logger.info('Successfully imported Flask app')
# except Exception as e:
#     logger.error(f'Failed to import Flask app: {e}')
#     raise

# # Create the Flask application instance
# try:
#     app = create_app()
#     logger.info('Flask app created successfully')
# except Exception as e:
#     logger.error(f'Failed to create Flask app: {e}')
#     raise

# # Create tables if they don't exist (for initial setup)
# with app.app_context():
#     try:
#         db.create_all()
#         logger.info("Database tables created successfully")
#         print("Database tables created successfully")
#     except Exception as e:
#         logger.error(f"Error creating database tables: {e}")
#         print(f"Error creating database tables: {e}")

# # This is what most WSGI servers will look for
# application = app

# # Add some debugging info
# logger.info(f'Python version: {sys.version}')
# logger.info(f'Current working directory: {os.getcwd()}')
# logger.info(f'Python path: {sys.path}')
# logger.info('Application is ready to serve requests')

# if __name__ == '__main__':
#     logger.info('Running in development mode')
#     app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))


#!/usr/bin/env python3
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Starting simple Flask test...")

try:
    from flask import Flask, jsonify
    print("Flask imported successfully")
    
    app = Flask(__name__)
    
    @app.route('/')
    def test():
        return jsonify({"status": "Flask is working", "message": "API is running"})
    
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy"})
    
    # This is what WSGI servers look for
    application = app
    print("Simple Flask app created successfully")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
    
    # Fallback WSGI application
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-type', 'application/json')]
        start_response(status, headers)
        return [f'{{"error": "Flask startup failed: {str(e)}"}}'.encode()]

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)