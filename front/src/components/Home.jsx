import React, {Component, useState} from 'react'

import {
    getAllBooks, rateBook
} from '../services/apiService';
import Header from "./Header/Header";
import 'bootstrap/dist/css/bootstrap.css';
import 'home.css';
import classes from "../assets/jss/material-kit-react/components/customLinearProgressStyle";
import {CardContent, Grid, Typography, Card} from "@material-ui/core";

export default class Home extends Component {

    state = {
        books: [],
        isbnToRate: null,
        rating: ''
    };

    componentDidMount() {
        getAllBooks()
            .then((data) => {
                this.setState({ books: data['books'] })
        })
    }

    stars(rating) {
        let stars = [];
        for (let i=0; i <rating; i++) {
            stars.push(<i className="fa fa-star"/>);
        }
        return stars;
    }

    rater(name) {
        return <button className="btn btn-sm btn-outline-secondary disabled">{name}</button>;
    }

    biancaRated(item) {
        return item['reviewers'].some(item => item.name === 'Bianca Ritorto');
    }

    openRateModal(e) {
        const rating = prompt('Rate the book')
        const parsedRating = parseInt(rating, 10);
        if (parsedRating === undefined || parsedRating < 0 || parsedRating > 5) {
            alert("Please enter a valid rating")
        } else {
            rateBook(e.target.id, rating).then(() => window.location.reload());
        }
    }

    render() {
        return (
            <div>
                <Header/>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '100vh'}}
                    spacing={1}>
                    {
                    this.state.books.map((item) => (
                        <Grid item xs={5}>
                            <Card className= "MuiCard-root" variant="outlined" style={{display: 'inline-block'}}>
                                <CardContent key={item['isbn']}>
                                    <Typography className={classes.title} variant="h5" color="textSecondary">
                                        {item['title']}
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        {item['description']}
                                    </Typography>
                                    {item['rating'] === 0 ? null :
                                        <div className="d-flex justify-content-center">
                                            <div className="content text-center">
                                                <div className="ratings">
                                                    <span className="product-rating">{item['rating']}</span>
                                                    <span>/5</span>
                                                    <div className="stars">
                                                        {this.stars(item['rating'])}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    <div>
                                        {
                                            item['reviewers'].length === 0 ? null :
                                                <Typography className="variant2"> Rated by: </Typography>
                                        }
                                    </div>
                                    <div>
                                        {
                                            item['reviewers'].length === 0 ? null :
                                                item['reviewers'].map(item => this.rater(item.name))
                                        }
                                    </div>
                                    <div>
                                        {this.biancaRated(item) ? null :
                                            <button
                                                id={item['isbn']}
                                                data-bs-toggle="modal"
                                                data-bs-target="#myModal"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={this.openRateModal.bind(this)}
                                            >Rate this book</button>
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    </Grid>
            </div>

        );
    }
}