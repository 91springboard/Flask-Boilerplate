from flask import Flask
from config import *

app = Flask(__name__,
            template_folder=TEMPLATE_FOLDER,
            static_url_path=STATIC_URL_PATH,
            static_folder=STATIC_FOLDER)

# config set up
app.config.from_object('config')

# import views
from app.views import main

# register blueprints
app.register_blueprint(main.mod)

# import helper utilities
from app import helpers
