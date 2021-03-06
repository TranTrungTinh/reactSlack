import React, { Component } from 'react'
import firebase from '../../firebase';

import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Login extends Component {

  state = {
    email: '',
    password: '',
    errors: [],
    loading: false
  };

  handleChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if(!this.isFormValid(this.state)) return;
    this.setState({ errors: [], loading: true });
    firebase
    .auth()
    .signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => this.setState({ loading: false }))
    .catch(err => this.setState({ errors: this.state.errors.concat(err), loading: false }));    
  }

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
  }

  isFormValid = ({email, password}) => email && password;

  displayError = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="login">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center" >
            <Icon name="snapchat ghost" color="violet" />
            Login to DevChat
          </Header>

          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked >
              
              <Form.Input 
                fluid name="email" 
                icon="mail" 
                iconPosition="left" 
                placeholder="Email Address" 
                onChange={this.handleChange} 
                type="text" 
                value={email}
                className={this.handleInputError(errors, 'email')}
              />
              
                
              <Form.Input 
                fluid name="password" 
                icon="lock" 
                iconPosition="left" 
                placeholder="Password" 
                onChange={this.handleChange} 
                type="password" 
                value={password}
                className={this.handleInputError(errors, 'password')}
              />
              
              <Button 
                fluid 
                color="violet" 
                size="large"
                disabled={loading}
                className={loading ? "loading" : ""}
              >
                Login
              </Button>
            </Segment>
          </Form>
          { errors.length > 0 && ( 
          <Message error>
            <h3>Error</h3>
            {this.displayError(errors)}
          </Message>
          )}
          <Message>Don't have an account? <Link to="/register">Register</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}
