from typing import Optional
from flask import Flask
from flask import request
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
    q = "MATCH (:Book {{isbn: '{}'}})<-[r:rates]-(u:User) RETURN PROPERTIES(r) as reviews, u.name as user".format(isbn)
    result = neo4j.query(q)
    return {'reviews': result}


@app.route('/user/reviews/<user_id>', methods=['GET'])
def get_all_user_reviews(user_id):
    q = "MATCH (b:Book)<-[r:rates]-(u:User{{id:'{}'}}) RETURN b.title as title, b.isbn as isbn, PROPERTIES(r) as rating".format(user_id)
    results = neo4j.query(q)
    responses = []
    for result in results:
        cursor = books_collection.find_one({'isbn': result[1]})
        response = {'title': result[0], 'description': cursor['description'], 'rating': result[2]['rating']}
        responses.append(response)
    return {'user_reviews': responses}


@app.route('/user/friends/books/<user_id>', methods=['GET'])
def get_all_user_friends_books(user_id):
    q = "MATCH (b:Book)<-[:rates]-(:User)<-[:friend]-(u:User{{id:'{}'}}) RETURN DISTINCT b.isbn as isbn".format(user_id)
    results = neo4j.query(q)
    responses = []
    for result in results:
        cursor = books_collection.find_one({'isbn': result[0]})
        response = {'title': cursor['title'], 'description': cursor['description']}
        responses.append(response)
    return {'friends_books': responses}


@app.route('/user/friends/<user_id>', methods=['GET'])
def get_all_user_friends(user_id):
    q = "MATCH (u1:User)<-[:friend]-(u:User{{id:'{}'}}) RETURN u1.name".format(user_id)
    results = neo4j.query(q)
    responses = []
    for result in results:
        response = {'name': result[0]}
        responses.append(response)
    return {'friends': responses}


@app.route('/rating/<isbn>', methods=['POST'])
def post_rating(isbn):
    rating = request.get_json()['rating']
    q = "MATCH (b:Book), (u:User) WHERE b.isbn = '{}' AND u.id = '27' CREATE (u)-[r:rates {{rating: '{}'}}]->(b) RETURN type(r)".format(isbn, rating)
    result = neo4j.query(q)
    if result[0][0] == 'rates':
        return {'success': 'true'}
    return {'success': 'false'}


if __name__ == '__main__':
    app.run(host='0.0.0.0')
