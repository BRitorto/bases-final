from typing import Optional
from flask import Flask
from pymongo import MongoClient
from pydantic import BaseModel
from Neo4jConnection import Neo4jConnection

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
mongodb = mongo['bases']
books_collection = mongodb['books']
users_collection = mongodb['users']
reviews_collection = mongodb['reviews']

neo4j = Neo4jConnection(uri='bolt://localhost:7687')


@app.route('/')
def hello_world():
    return {"Hello": "world"}


@app.route('/all_books/', methods=['GET'])
def get_all_books():
    cursor = books_collection.find({}, {'_id': False})
    return {'books': [doc for doc in cursor]}


@app.route('/ratings/<isbn>', methods=['GET'])
def get_ratings(isbn):
    q = "MATCH (:Book {{isbn: '{}'}})<-[r:rates]-() RETURN PROPERTIES(r)".format(isbn)
    result = neo4j.query(q)
    return {'reviews': result}


@app.route('/reviews/<isbn>', methods=['GET'])
def get_user_reviews(isbn):
    q = "MATCH (:Book {{isbn: '{}'}})<-[r:rates]-(u:User) RETURN u {{.name, .id}} as user".format(isbn)
    result = neo4j.query(q)
    return {'user_reviews': result}


@app.route(c, methods=['GET'])
def get_all_user_reviews(user_id):
    q = "MATCH (b:Book)<-[r:rates]-(u:User{{id:'{}'}}) RETURN b.title as title, b.isbn as isbn, PROPERTIES(r) as rating".format(user_id)
    results = neo4j.query(q)
    responses = []
    for result in results:
        cursor = books_collection.find_one({'isbn': result[1]})
        response = {'title': result[0], 'description': cursor['description'], 'rating': result[2]['rating']}
        responses.append(response)
    return {'user_reviews': responses}


if __name__ == '__main__':
    app.run(host='0.0.0.0')
