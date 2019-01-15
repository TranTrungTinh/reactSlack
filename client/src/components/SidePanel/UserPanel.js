import React, { Component } from 'react'
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import firebase from '../../firebase';

export default class UserPanel extends Component {

  state = {
    user: this.props.currentUser
  }

  dropDownOptions = () => [
    {
      key: 'user',
      text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
      disabled: true
    },
    {
      key: 'avatar',
      text: <span>Change avatar</span>
    },
    {
      key: 'signout',
      text: <span onClick={this.signOutHandle}>Sign out</span>
    }
  ]

  signOutHandle = () => {
    firebase.auth().signOut()
    .then(() => console.log('signed out'))
  }

  render() {
    const { user } = this.state;
    const { color } = this.props;
    
    return (
      <Grid style={{ background: color.primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code"/>
              <Header.Content>DevChat</Header.Content>
            </Header>

            <Header inverted style={{ padding: '0.25em' }} as="h4">
              <Dropdown 
                trigger={
                  <span>
                    <Image avatar spaced src={ user.photoURL } />
                    {user.displayName}
                  </span>
                } 
                options={this.dropDownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    )
  }
}
