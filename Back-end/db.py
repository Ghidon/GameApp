from flask import Flask
from flask_pymongo import pymongo
from pymongo import MongoClient

CONNECTION_STRING = "mongodb+srv://admin:Muntok123@cluster0.rgg7w.mongodb.net/<dbname>?retryWrites=true&w=majority"
client = MongoClient(CONNECTION_STRING)
db = client.get_database('game_app')
user_collection = pymongo.collection.Collection(db, 'user_collection')
