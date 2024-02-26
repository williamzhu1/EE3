## DOTENV

make a `.env` file with the following contents:

```
LICHESS_CLIENT_ID="lichess-oauth-flask"
SECRET_KEY="{ secure random key for flask sessions }"
LICHESS_TOKEN="<YOUR_TOKEN_WITH_APPROPRIATE_PERMISSIONS>" (https://lichess.org/account/oauth/token)
```

## RUNNING THE SERVER

```
install python
pip install pipenv
pipenv install
flask run
```

## RUNNING THE CLIENT

```
npm i
npm start
```
