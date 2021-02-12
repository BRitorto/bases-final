import React, { Component } from 'react'
import {CardContent, List, ListItem, ListItemText, Typography} from "@material-ui/core";

import {
    getAllBooks
} from '../services/apiService';
import CardBody from "./Card/CardBody";
import Card from "./Card/Card";
import Header from "./Header/Header";

export default class Home extends Component {

    state = { books: [] };

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
                {
                this.state.books.map((item) => (
                    <Card>
                        <CardBody key={item['isbn']}>
                            <Typography className={"name"} color="textSecondary" gutterBottom>
                                {item['title']}
                            </Typography>
                            <Typography variant="body2" component="p">
                                {item['description']}
                            </Typography>
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    }
}