import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesFrom';
import Message from './Message';

export default class Messages extends Component {
  state = {
    messageRef: firebase.database().ref('Messages'),
    messages: [],
    messageLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser
  }

  componentDidMount() {
    const { channel, user } = this.state;
    if(channel && user) {
      this.addListener(channel.id);
    }
  }

  addListener = channelId => {
    this.addMessageListener(channelId);
  }

  addMessageListener = channelId => {
    let loadMessages = [];
    this.state.messageRef.child(channelId).on('child_added', snap => {
      loadMessages.push(snap.val());
      this.setState({ messages: loadMessages, messageLoading: false });
    });
  }

  displayMessages = messages => (
    messages.length > 0 && messages.map(message => (
      <Message 
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ))
  )

  render() {
    const { messageRef, messages, channel, user } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessagesForm 
          messageRef={messageRef}
          currentChannel={channel}
          currentUser={user}
        />
      </React.Fragment>
    )
  }
}
