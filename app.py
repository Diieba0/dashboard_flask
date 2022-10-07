from flask import Flask, render_template, jsonify
import json
import requests

app = Flask(__name__)


@app.route("/")
def hello():
    return "Hello World!"


@app.route('/dashboard/')
def dashboard():
    return render_template("dashboard.html")


GRAND_DEBAT_API_KEY = None

if GRAND_DEBAT_API_KEY is None:
    # URL de test :
    GRAND_DEBAT_API_URL = "https://static.data.gouv.fr/resources/donnees-ouvertes-du-grand-debat-national/20200612-000534/cr-ril.json"  # exemple de JSON
else:
    # URL avec clé :
    GRAND_DEBAT_API_URL = "https://www.data.gouv.fr/fr/datasets/donnees-ouvertes-du-grand-debat-national/" + GRAND_DEBAT_API_KEY

response = requests.get(GRAND_DEBAT_API_URL)

content = json.loads(response.content.decode('utf-8'))



from functions import extract_answers
@app.route('/api/debat/')
def get_answers():
    if response.status_code != 200:
        return jsonify({
            'status': 'error',
            'message': 'La requête à l\'API des réunions locales n\'a pas fonctionné. Voici le message renvoyé par l\'API : {}'.format(
                content['message'])
        }), 500

    oui, non = extract_answers(content)

    return jsonify({
        'status': 'ok',
        'data': {
            'oui': len(oui),
            'non': len(non)
        }
    })


from functions import extract_themes
@app.route('/api/themes/')
def get_themes():
    if response.status_code != 200:
        return jsonify({
            'status': 'error',
            'message': 'La requête à l\'API des réunions locales n\'a pas fonctionné. Voici le message renvoyé par l\'API : {}'.format(
                content['message'])
        }), 500

    themes = extract_themes(content)

    return jsonify({
        'status': 'ok',
        'data': {
            'themes': themes,
        }
    })


from functions import extract_participation
@app.route('/api/participation/')
def get_participation():
    if response.status_code != 200:
        return jsonify({
            'status': 'error',
            'message': 'La requête à l\'API des réunions locales n\'a pas fonctionné. Voici le message renvoyé par l\'API : {}'.format(
                content['message'])
        }), 500

    participation = extract_participation(content)

    return jsonify({
        'status': 'ok',
        'data': {
            'participation': participation,
        }
    })


if __name__ == "__main__":
    app.run(debug=True)
