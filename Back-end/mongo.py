from flask import Flask, jsonify, request, json, Response
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended import create_access_token

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'game_app'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/game_app'
app.config['JWT_SECRET_KEY'] = 'secret'

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)

try:
    mongo = pymongo.MongoClient(
        host="localhost",
        port=27017,
        serverSelectionTimeoutMS=1000
    )
    db = mongo.game_app
    mongo.server_info()  # trigger exception if cannot connect to db

except:
    print("ERROR - Cannot connect to db")

##############


@app.route("/users", methods=["GET"])
def show_users():
    try:
        users = mongo.db.users
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
    users = mongo.db.users
    email = request.get_json()['email']
    test = users.find_one({"email": email})
    if test:
        return jsonify(message="User Already Exist"), 409
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
    users = mongo.db.users
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""

    response = users.find_one({'email': email})

    if response:
        if bcrypt.check_password_hash(response['password'], password):
            access_token = create_access_token(identity={
                'first_name': response['first_name'],
                'last_name': response['last_name'],
                'email': response['email']
            })
            result = jsonify(
                {'token': access_token, "result": "Login Successful"})
        else:
            result = jsonify(
                {"error": "Invalid password"})
    else:
        result = jsonify({"result": "No results found"})
    return result


if __name__ == '__main__':
    app.run(debug=True)
