import React, { Component } from 'react';
import firebase from './firebase';

import { connect } from 'react-redux';
import { setUser, clearUser } from './redux/actions';

import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Spinner from './components/utils/Spinner';

import { Switch, Route } from 'react-router-dom';

class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.setUser(user);
        this.props.history.push('/');
      } else {
        this.props.clearUser();
        this.props.history.push('/login');
      }
    });
  }
  render() {
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
})
export default connect(mapStateToProps, { setUser, clearUser })(Root);
