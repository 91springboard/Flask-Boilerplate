#!/usr/bin/env python
import unittest
from flask.ext.script import Manager
from app import app

manager = Manager(app)


@manager.command
def test():
    """Runs the unit tests"""
    tests = unittest.TestLoader().discover('tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    else:
        return 1


if __name__ == '__main__':
    manager.run()
