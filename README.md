### FlaskBoilerPlate

##### Features

    1. Flask Blueprint Support
    2. Environment based configuration
    3. Gulp tasks for local and production build
    4. Bootstrap
    5. Responsive sidebar


##### Requirements

    1. UBUNTU (12.04 or Higher)
    2. Python
    3. Virtualenv
    4. npm
    5. bower

##### Anatomy

        .
        |-- app
        |   |-- helpers.py
        |   |-- __init__.py
        |   `-- views
        |       |-- __init__.py
        |       `-- main.py
        |-- bower.json
        |-- config
        |   |-- base.py
        |   |-- dev.py
        |   |-- __init__.py
        |   `-- local.py
        |-- gulp.config.js
        |-- gulpfile.js
        |-- gunicorn.py
        |-- init.sh
        |-- manage.py
        |-- package.json
        |-- README.md
        |-- requirements.txt
        |-- src
        |   |-- static
        |   |   |-- c3.json
        |   |   |-- img
        |   |   |   `-- logo.png
        |   |   |-- sass
        |   |   |   |-- style-responsive.scss
        |   |   |   `-- style.scss
        |   |   `-- scripts
        |   |       `-- app.js
        |   `-- templates
        |       |-- base.html
        |       |-- index.html
        |       `-- sidebar.html
        `-- tests
            |-- base.py
            |-- __init__.py
            `-- test_config.py

        10 directories, 28 files


##### How to run this boilerplate
Open terminal & go into root directory
for local development execute

``` bash
        ./init.sh
```

for dev build execute

``` bash
        ./init.sh dev
```


for production build execute

``` bash
        ./init.sh prod
```


#### Details of Gulp Task

will be added soon


#### Assumption2

    1. You have ownership of .npm directory
       if not, to reclaim ownership of the .npm directory execute
``` bash
        sudo chown -R $(whoami) ~/.npm
```


    2. Port 5000 is unused
        if not then execute
``` bash
        sudo  kill -9 $(lsof -i:5000 -t)
```
