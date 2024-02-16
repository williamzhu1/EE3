import os

from flask import Flask, jsonify
from flask import url_for

from dotenv import load_dotenv
load_dotenv()

import requests

from authlib.integrations.flask_client import OAuth

LICHESS_HOST = os.getenv("LICHESS_HOST", "https://lichess.org")

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
app.config['LICHESS_CLIENT_ID'] =  os.getenv("LICHESS_CLIENT_ID")
app.config['LICHESS_AUTHORIZE_URL'] = f"{LICHESS_HOST}/oauth"
app.config['LICHESS_ACCESS_TOKEN_URL'] = f"{LICHESS_HOST}/api/token"

oauth = OAuth(app)
oauth.register('lichess', client_kwargs={"code_challenge_method": "S256"})

@app.route('/')
def login():
    redirect_uri = url_for("authorize", _external=True)
    """
    """
    return oauth.lichess.authorize_redirect(redirect_uri)

@app.route('/authorize')
def authorize():
    token = oauth.lichess.authorize_access_token()
    bearer = token['access_token']
    headers = {'Authorization': f'Bearer {bearer}'}
    response = requests.get(f"{LICHESS_HOST}/api/account", headers=headers)
    return jsonify(**response.json())

if __name__ == '__main__':
    app.run()