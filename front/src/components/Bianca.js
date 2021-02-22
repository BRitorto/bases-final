import React, {Component} from "react";
import Header from "./Header/Header";
import {getFriendsBooks, getUserReviews} from "../services/apiService";
import {Box, Card, CardContent, Grid, Typography} from "@material-ui/core";
import classes from "../assets/jss/material-kit-react/components/customLinearProgressStyle";
import 'home.css';
import 'bootstrap/dist/css/bootstrap.css';

export default class Bianca extends Component {

    state = {
        reviews: [],
        friends_reviews: []
    };

    componentDidMount() {
        getUserReviews(27)
            .then((data) => {
                this.setState({reviews: data['user_reviews']})
            });
        getFriendsBooks(27)
            .then((data) => {
                this.setState({friends_reviews: data['friends_books']})
            });
    }

    stars(rating) {
        let stars = [];
        for (let i=0; i <rating; i++) {
            stars.push(<i className="fa fa-star"/>);
        }
        return stars;
    }

    render() {
        return (
            <div>
              <Header/>
                <div className="row">
                    <div className="col px-md-5">
                        <h1 className="font-weight-lighter" style={{paddingBottom: "1.5%"}}>My ratings</h1>
                    </div>
                    <div className="col px-md-5">
                        <h1 className="font-weight-lighter" style={{paddingBottom: "1.5%"}}>Friends also read</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col px-md-5" style={{alignItems:"center", justify:"center"}}>
                        {
                            this.state.reviews.map((item) => (
                            <Card className= "MuiCard-root" variant="outlined" style={{display: 'inline-block'}}>
                                <CardContent key={item['isbn']}>
                                    <Typography className={classes.title} variant="h5" color="textSecondary">
                                        {item['title']}
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        {item['description']}
                                    </Typography>
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
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="col px-md-5">
                      {
                          this.state.friends_reviews.map((item) => (
                            <Card className= "MuiCard-root" variant="outlined" style={{display: 'inline-block'}}>
                                <CardContent key={item['isbn']}>
                                    <Typography className={classes.title} variant="h5" color="textSecondary">
                                        {item['title']}
                                    </Typography>
                                    <Typography variant="body1" component="p">
                                        {item['description']}
                                    </Typography>
                                </CardContent>
                            </Card>
                      ))}
                    </div>
                </div>
            </div>
        );
    }
}