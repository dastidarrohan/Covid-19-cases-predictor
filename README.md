# Covid-19-cases-predictor
A Django based web-development project integrated with Machine Learning, that helps forecast the total number of cases related to Covid-19, such as number of deaths, active cases, recovery cases, etc.

Setup

The first thing to do is to clone the repository:

$ git clone https://github.com/dastidarrohan/Covid-19-cases-predictor.git
$ cd Covid-19-cases-predictor
Create a virtual environment to install dependencies in and activate it:

$ virtualenv2 --no-site-packages env
$ source covid19/bin/activate
Then install the dependencies:

(env)$ pip install -r requirements.txt
Note the (env) in front of the prompt. This indicates that this terminal session operates in a virtual environment set up by virtualenv2.

Once pip has finished downloading the dependencies:

(env)$ cd project
(env)$ python manage.py runserver
And navigate to http://127.0.0.1:8000
