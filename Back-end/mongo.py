from flask import Flask, jsonify, request, json, Response
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token
import db

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'secret'

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)

##############


@app.route("/users", methods=["GET"])
def show_users():
    try:
        users = db.db.users
        data = list(users.find())
        for user in data:
            user["_id"] = str(user["_id"])
        return Response(
            response=json.dumps(data, default=str),
            status=200,
            mimetype="application/json"
        )

    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps(
                {"message": "Cannot read Users"}),
            status=500,
            mimetype="application/json"
        )

##############


@app.route('/users/register', methods=["POST"])
def register():
    users = db.db.users
    email = request.get_json()['email']
    test = users.find_one({"email": email})
    if test:
        return jsonify(message="User already registered"), 409
    else:
        user = {
            'first_name': request.get_json()['first_name'],
            'last_name': request.get_json()['last_name'],
            'email': request.get_json()['email'],
            'password': bcrypt.generate_password_hash(
                request.get_json()['password']).decode('utf-8'),
            'created': datetime.utcnow()
        }
        users.insert_one(user)
        return jsonify(message="User added successfully"), 201

##############


@app.route('/users/login', methods=['POST'])
def login():
    users = db.db.users
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""

    response = users.find_one({'email': email})

    if response:
        if bcrypt.check_password_hash(response['password'], password):
            access_token = create_access_token(identity={
                'first_name': response['first_name'],
                'last_name': response['last_name'],
                'email': response['email'],
                'created': response['created']
            })
            result = jsonify(
                {'token': access_token, "result": "Login Successful"})
        else:
            result = jsonify(
                {"error": "Wrong Password or Email"})
    else:
        result = jsonify({"error": "Wrong Email or Password"})
    return result

##############


@app.route('/games/createGame', methods=["POST"])
def createNewGame():
    games = db.db.games
    game_name = request.get_json()['game_name']
    test = games.find_one({"game_name": game_name})
    if test:
        return jsonify(message="There is already a game named like this"), 409
    else:
        game = {
            'game_name': request.get_json()['game_name'],
            'creator': request.get_json()['creator'],
            'created': datetime.utcnow(),
            'players': request.get_json()['players'],
        }
        games.insert_one(game)
        return jsonify(message="Game created successfully"), 201

##############


@app.route("/games", methods=["GET"])
def show_games():
    try:
        games = db.db.games
        data = list(games.find())
        for game in data:
            game["_id"] = str(game["_id"])
        return Response(
            response=json.dumps(data, default=str),
            status=200,
            mimetype="application/json"
        )

    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps(
                {"message": "Cannot read Games"}),
            status=500,
            mimetype="application/json"
        )

##############


@app.route("/games/<email>", methods=["GET"])
def find_game_by_email(email):
    try:
        games = db.db.games
        creatordata = list(games.find({"creator": email}))
        playerData = list(games.find({"players": email}))
        data = creatordata + playerData

        for game in data:
            game["_id"] = str(game["_id"])
        return Response(
            response=json.dumps(data, default=str),
            status=200,
            mimetype="application/json"
        )

    except Exception as ex:
        print(ex)
        return Response(
            response=json.dumps(
                {"message": "Could not retrieve games"}),
            status=500,
            mimetype="application/json"
        )

##############


if __name__ == '__main__':
    app.run(port=8000)
