from base import BaseTestCase
from flask import current_app
from app import app
import os
import unittest


class TestAppConfig(BaseTestCase):
    ''' Test the app config file value correct or not'''

    def test_app_common_config(self):
        ''' Test the app common value config value'''
        self.assertTrue(current_app.config['TESTING'])
        self.assertFalse(current_app is None)
        pass

    def test_app_local_config(self):
        ''' Test the app local config value'''
        # common value test will go here
        # get the enviroment value
        environment = os.environ.get('CONFIG', 'local')
        # if local then check local config value
        if environment == 'local':
            self.assertTrue(app.config['ENV'] is 'local')

    def test_app_devlopment_config(self):
        '''Test the app development config value '''
        environment = os.environ.get('CONFIG', 'local')
        if environment == 'dev':
            self.assertTrue(app.config['ENV'] is 'dev')

if __name__ == '__main__':
    unittest.main()
