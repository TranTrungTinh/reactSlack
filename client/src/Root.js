import React, { Component } from 'react';
import firebase from './firebase';

import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import { Switch, Route } from 'react-router-dom';

export default class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) this.props.history.push('/')
    });
  }
  render() {
    return (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    )
  }
}
