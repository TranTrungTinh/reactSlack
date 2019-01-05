import React, { Component } from 'react'
import firebase from '../../firebase';
import md5 from 'md5';

import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default class Register extends Component {

  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
    usersRef: firebase.database().ref('Users')
  };

  handleChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if(!this.isFormValid()) return;
    this.setState({ errors: [], loading: true });
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(newUser => {
        // console.log(newUser);
        newUser.user.updateProfile({
          displayName: this.state.username,
          photoURL: `http://gravatar.com/avatar/${md5(newUser.user.email)}?d=identicon`
        })
        .then(() => this.saveUser(newUser))
        .then(() => this.setState({ loading: false }))
        .catch(err => this.setState({ errors: this.state.errors.concat(err), loading: false }));
      })
      .catch(err => this.setState({ errors: this.state.errors.concat(err), loading: false }));
  }

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
  }

  isFormValid = () => {
    let errors = [];
    let error = '';

    if(this.isFormEmpty(this.state)) {
      error = { message: 'Please fill in all fields.' };
      this.setState({ errors: errors.concat(error) });
      return false;
    }
    if(!this.isPasswordValid(this.state)) {
      error = { message: 'Password is invalid.' };
      this.setState({ errors: errors.concat(error) });
      return false;
    }
    return true;
  }

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if(password < 6 || passwordConfirmation < 6) return false;
    if(password !== passwordConfirmation) return false;
    return true;
  }

  displayError = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

  saveUser = ({ user }) => {
    return this.state.usersRef.child(user.uid).set({
      name: user.displayName,
      avatar: user.photoURL
    })
  }

  render() {
    const { username, email, password, passwordConfirmation, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center" >
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>

          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked >
              <Form.Input 
                fluid name="username" 
                icon="user" iconPosition="left" 
                placeholder="Username" 
                onChange={this.handleChange} 
                type="text"
                value={username}
              />
              
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
              
                
              <Form.Input 
                fluid name="passwordConfirmation" 
                icon="repeat" iconPosition="left" 
                placeholder="Password Confirmation" 
                onChange={this.handleChange} 
                type="password" 
                value={passwordConfirmation}
                className={this.handleInputError(errors, 'password')}
              />
            
              <Button 
                fluid 
                color="orange" 
                size="large"
                disabled={loading}
                className={loading ? "loading" : ""}
              >
                Submit
              </Button>
            </Segment>
          </Form>
          { errors.length > 0 && ( 
          <Message error>
            <h3>Error</h3>
            {this.displayError(errors)}
          </Message>
          )}
          <Message>Already a user? <Link to="/login">Login</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}
