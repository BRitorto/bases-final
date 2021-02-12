from pymongo import MongoClient
import random
import json
from Neo4jConnection import Neo4jConnection

# Databases

mongo = MongoClient('localhost:27017')

mongodb = mongo['bases']
books_collection = mongodb['books']
users_collection = mongodb['users']
reviews_collection = mongodb['reviews']

neo4j = Neo4jConnection(uri='bolt://localhost:7687')

users = []
books = []
reviews = []


def create_users():
    user_id_count = 0
    names = open('files/names.txt', 'r')
    for name in names:
        user = {
            'name': name,
            'id': user_id_count
        }
        users.append(user)
        user_id_count += 1

    users_collection.drop()
    users_collection.insert_many(users)
    for u in users:
        q = "CREATE (u:User {{name:'{}', id:'{}'}});".format(u['name'], u['id'])
        neo4j.query(q)


def create_relationships():
    for i in range(len(users)):
        u1 = random.choice(users)
        u2 = u1
        while u2 == u1:
            u2 = random.choice(users)

        l1 = u1['id']
        l2 = u2['id']
        q = "MATCH (u1:User {{id: '{}'}}), (u2:User {{id: '{}'}}) \
            CREATE (u1)-[:friend]->(u2), (u2)-[:friend]->(u1);".format(l1, l2)
        neo4j.query(q)

    q = "MATCH (s)-[r]->(e) with s,e,type(r) as typ, tail(collect(r)) as coll foreach(x in coll | delete x)"
    neo4j.query(q)


def create_books():
    file = open('files/books.json', 'r')
    book_list = json.load(file)
    for book in book_list:
        entry = {
            'isbn': book['isbn'],
            'title': book['title'],
            'description': book['shortDescription'],
            'authors': book['authors']
        }
        books.append(entry)

    books_collection.drop()
    books_collection.insert_many(books)
    for b in books:
        q = "CREATE (b:Book {{isbn: '{}', title: '{}' }})".format(b['isbn'], b['title'])
        neo4j.query(q)


def create_reviews():
    file = open('files/reviews.json', 'r')
    review_list = json.load(file)
    for review in review_list:
        entry = {
            'isbn': review['isbn'],
            'user_id': review['user_id'],
            'rating': review['rating'],
            'comments': review['comments']
        }
        reviews.append(entry)

    reviews_collection.drop()
    reviews_collection.insert_many(reviews)
    for review in reviews:
        q = "MATCH (u:User {{id: '{}' }}), (b:Book {{ isbn: '{}'}}) CREATE (u)-[r:rates {{ rating: '{}' }}]->(b)"\
            .format(review['user_id'], review['isbn'], review['rating'])
        neo4j.query(q)


create_users()
create_relationships()
create_books()
create_reviews()

