from flask import Flask, render_template, jsonify
import json
import requests

app = Flask(__name__)

METEO_API_KEY = "d5d8636c0fa03a6714240d8bfee5ff32"
if METEO_API_KEY is None:
    # URL de test :
    METEO_API_URL = "https://samples.openweathermap.org/data/2.5/forecast?lat=0&lon=0&appid=xxx"
else:
    # URL avec clé :
    METEO_API_URL = "https://api.openweathermap.org/data/2.5/forecast?lat=48.883587&lon=2.333779&appid=" + METEO_API_KEY


@app.route("/")
def hello():
    return "Hello World!"


@app.route('/dashboard/')
def dashboard():
    return render_template("dashboard.html")


@app.route('/api/meteo/')
def meteo():
    response = requests.get(METEO_API_URL)
    content = json.loads(response.content.decode('utf-8'))

    if response.status_code != 200:
        return jsonify({
            'status': 'error',
            'message': 'La requête à l\'API météo n\'a pas fonctionné. Voici le message renvoyé par l\'API : {}'.format(
                content['message'])
        }), 500

    data = []  # On initialise une liste vide
    for prev in content["list"]:
        datetime = prev['dt'] * 1000
        temperature = prev['main']['temp'] - 273.15  # Conversion de Kelvin en °c
        temperature = round(temperature, 2)
        data.append([datetime, temperature])

    return jsonify({
        'status': 'ok',
        'data': data
    })


from functions import extract_keywords

NEWS_API_KEY = "5de7d028984d46de9c6cf7c961b12f7b"  # Remplacez None par votre clé NEWSAPI, par exemple "4116306b167e49x993017f089862d4xx"

if NEWS_API_KEY is None:
    # URL de test :
    NEWS_API_URL = "https://s3-eu-west-1.amazonaws.com/course.oc-static.com/courses/4525361/top-headlines.json"  # exemple de JSON
else:
    # URL avec clé :
    NEWS_API_URL = "https://newsapi.org/v2/top-headlines?sortBy=publishedAt&pageSize=100&language=fr&apiKey=" + NEWS_API_KEY


@app.route('/api/news/')
def get_news():
    response = requests.get(NEWS_API_URL)

    content = json.loads(response.content.decode('utf-8'))

    if response.status_code != 200:
        return jsonify({
            'status': 'error',
            'message': 'La requête à l\'API des articles d\'actualité n\'a pas fonctionné. Voici le message renvoyé par l\'API : {}'.format(
                content['message'])
        }), 500

    keywords, articles = extract_keywords(content["articles"])

    return jsonify({
        'status': 'ok',
        'data': {
            'keywords': keywords[:100],  # On retourne uniquement les 100 premiers mots
            'articles': articles
        }
    })

if __name__ == "__main__":
    app.run(debug=True)
