import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input } from 'semantic-ui-react';

export default class MessagesFrom extends Component {

  state = {
    message: '',
    user: this.props.currentUser,
    channel: this.props.currentChannel,
    loading: false,
    errors: []
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  createMessage = ({ user, message }) => ({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    user: {
      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL
    },
    content: message
  })

  sendMessage = () => {
    const { messageRef } = this.props;
    const { message, channel, errors } = this.state;
    if(message) {
      this.setState({ loading: true });
      messageRef
        .child(channel.id)
        .push()
        .set(this.createMessage(this.state))
        .then(() => this.setState({ loading: false, message: '', errors: [] }))
        .catch(err => this.setState({ loading: false, errors: errors.concat(err) }));
    } else {
      this.setState({ errors: errors.concat({message: 'Please add a message...'}) })
    }
  }

  displayStatusMessage = errors => (
    errors.some(error => error.message.includes('message')) ? 'error' : ''
  )
  

  render() {
    const { errors, message, loading } = this.state;
    return (
      <Segment className="message__form">
        <Input 
          fluid
          name="message"
          value={message}
          style={{ marginBottom: '0.7em' }}
          label={<Button icon="add"/>}
          labelPosition="left"
          placeholder="Write your message"
          onChange={this.handleChange}
          className={this.displayStatusMessage(errors)}
        />

        <Button.Group icon widths="2">
          <Button 
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            disabled={loading}
          />
          <Button 
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    )
  }
}
