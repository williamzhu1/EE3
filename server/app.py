import os

from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import berserk
from dotenv import load_dotenv
import requests
load_dotenv()

from authlib.integrations.flask_client import OAuth

LICHESS_HOST = os.getenv("LICHESS_HOST", "https://lichess.org")

app = Flask(__name__)
CORS(app)
app.secret_key = os.getenv("SECRET_KEY")
app.config['LICHESS_CLIENT_ID'] =  os.getenv("LICHESS_CLIENT_ID")
app.config['LICHESS_TOKEN'] =  os.getenv("LICHESS_TOKEN")
app.config['LICHESS_AUTHORIZE_URL'] = f"{LICHESS_HOST}/oauth"
app.config['LICHESS_ACCESS_TOKEN_URL'] = f"{LICHESS_HOST}/api/token"

oauth = OAuth(app)
oauth.register('lichess', client_kwargs={"code_challenge_method": "S256"})

session = berserk.TokenSession(app.config['LICHESS_TOKEN'])
client = berserk.Client(session=session)

@app.route('/create_game', methods=['POST'])
def create_game():
    data = request.json
    level = data.get('level', 1)
    clock_limit = data.get('clock_limit', 300)
    clock_increment = data.get('clock_increment', 0)
    color = data.get('color', 'white')
    
    response = client.challenges.create_ai(
        level=level,
        clock_limit=clock_limit, 
        clock_increment=clock_increment, 
        color=color, 
        variant='standard',
        position=None
        )
    
    return jsonify(response)

@app.route('/game_state/<game_id>')
def game_state(game_id):
    response = requests.get(f"{LICHESS_HOST}/api/board/game/stream/{game_id}", headers=session.headers, stream=True)
    
    return Response(response, content_type='application/x-ndjson')

@app.route('/make_move/<game_id>', methods=['POST'])
def make_move(game_id):
    move = request.get_json().get('move')
    response = client.board.make_move(game_id, move)

    return jsonify(response)

if __name__ == '__main__':
    app.run()
