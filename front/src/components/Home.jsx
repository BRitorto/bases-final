import React, { Component } from 'react'

import {
    getAllBooks
} from '../services/apiService';
import Header from "./Header/Header";
import 'bootstrap/dist/css/bootstrap.css';
import classes from "../assets/jss/material-kit-react/components/customLinearProgressStyle";
import {CardContent, Grid, Typography, Card} from "@material-ui/core";

export default class Home extends Component {

    state = {
        books: []};

    componentDidMount() {
        getAllBooks()
            .then((data) => {
                this.setState({ books: data['books'] })
        })
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
                                    <Typography variant="body2">
                                        Rating: {item['rating']}
                                    </Typography>
                                    <Typography variant="body2">
                                       Rated by: {item['reviewers'].map(item => item.name + " ")}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    </Grid>
            </div>
        );
    }
}