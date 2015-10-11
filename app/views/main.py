from flask import Blueprint, render_template

mod = Blueprint('main', __name__, url_prefix="",
                template_folder="dev")


@mod.before_request
def before_request():
    print "Before request called"


@mod.after_request
def after_request(response):
    print "After request called"
    return response


@mod.teardown_request
def teardown_request(response):
    print "Tear Down called"
    return response


@mod.route("/", methods=['GET'])
def index():
    return render_template('index.html')
