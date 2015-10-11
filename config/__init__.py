from base import *
import os

environment = os.environ.get('CONFIG', 'local')

if environment == 'local':
    from local import *
elif environment == 'dev':
    from dev import *
