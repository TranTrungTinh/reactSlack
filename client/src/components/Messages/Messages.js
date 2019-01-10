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
    user: this.props.currentUser,
    progressBar: false,
    numUniqueUsers: '',
    searchTem: '',
    searchLoading: false,
    searchResults: []
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
      this.countUniqueUsers(loadMessages);
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

  displayChannelName = channel => channel ? `#${channel.name}` : '';

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if(!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1;
    const numUniqueUsers = `${uniqueUsers.length} User${plural ? 's' : ''}`;
    this.setState({ numUniqueUsers });
  }

  isProgressBarVisible = percent => {
    if(percent > 0) this.setState({ progressBar: true });
  }

  handleSearchChange = event => {
    this.setState({
      searchTem: event.target.value,
      searchLoading: true
    }, this.handleSearchMessages)
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTem, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if(message.content && 
        (message.content.match(regex) || message.user.name.match(regex))) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  }

  render() {
    const { messageRef, messages, channel, user, progressBar, 
      numUniqueUsers, searchTem, searchResults, searchLoading } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader 
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
        />

        <Segment>
          <Comment.Group className={progressBar ? 'message__progress' : 'messages'}>
            { searchTem ? this.displayMessages(searchResults) : 
            this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessagesForm 
          messageRef={messageRef}
          currentChannel={channel}
          currentUser={user}
          isProgressBarVisible={this.isProgressBarVisible}
        />
      </React.Fragment>
    )
  }
}
