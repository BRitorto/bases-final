import time
from typing import Optional
from flask import Flask, render_template
from flask_cors import CORS
from pymongo import MongoClient
from pydantic import BaseModel
from Neo4jConnection import Neo4jConnection

time.sleep(15)

# Models
class Review(BaseModel):
    user_id: int
    rating: int
    comment: Optional[str] = None
    isbn: str


class Book(BaseModel):
    isbn: int
    title: str
    description: str
    authors: list


class User(BaseModel):
    username: str
    user_id: int


app = Flask(__name__)

# Databases
mongo = MongoClient('localhost:27017')
mongo.drop_database('bases')
mongodb = mongo['bases']
books_collection = mongodb['books']
users_collection = mongodb['users']
reviews_collection = mongodb['reviews']

neo4j = Neo4jConnection(uri='bolt://localhost:7687')


@app.route('/')
def hello_world():
    return {"Hello": "world"}


@app.route('/all_books', methods=['GET'])
def get_all_books():
    cursor = books_collection.find({}, {'_id': False})
    return {'books': [doc for doc in cursor]}


if __name__ == '__main__':
    app.run()
