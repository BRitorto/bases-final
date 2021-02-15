import React, {Component} from "react";
import Header from "./Header/Header";
import {getUserReviews} from "../services/apiService";
import {Box, Card, CardContent, Grid, Typography} from "@material-ui/core";
import classes from "../assets/jss/material-kit-react/components/customLinearProgressStyle";

export default class Bianca extends Component {

    state = {
        reviews: []
    };

    componentDidMount() {
        getUserReviews(27)
            .then((data) => {
                this.setState({reviews: data['user_reviews']})
            });
    }

    render() {
        return (
            <div>
              <Header/>
              <Box m={2} pt={3}>
                  <Typography className="titles" variant="h2" gutterBottom>
                        My ratings
                </Typography>
              <Grid
                    container
                    direction="row"
                    spacing={3}>
                    {
                    this.state.reviews.map((item) => (
                        <Grid item xs={4}>
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
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
              </Grid>
                <Typography className="titles" variant="h2" gutterBottom>
                        Friends also read
                </Typography>
                    <Grid
                    container
                    direction="row"
                    spacing={3}>
                  {
                    this.state.reviews.map((item) => (
                        <Grid item xs={4}>
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
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    </Grid>
                  </Box>
            </div>
        );
    }
}