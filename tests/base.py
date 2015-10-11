# tests/base.py
from flask.ext.testing import TestCase

from app import app


class BaseTestCase(TestCase):
    ''' base class for the all test class'''

    def create_app(self):
        app.config['TESTING'] = True
        # Default port is 5000
        return app

    def setUp(self):
        ''' create the temporary data base'''
        pass

    def tearDown(self):
        ''' delete the database after testing'''
        pass
