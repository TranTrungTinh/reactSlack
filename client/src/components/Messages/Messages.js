import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {setUserPost} from '../../redux/actions';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesFrom';
import Message from './Message';
import Typing from './Typing';

class Messages extends Component {
  state = {
    messageRef: firebase.database().ref('Messages'),
    messages: [],
    messageLoading: true,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    usersRef: firebase.database().ref('Users'),
    progressBar: false,
    numUniqueUsers: '',
    searchTem: '',
    searchLoading: false,
    searchResults: [],
    isStarChannel: false,
    typingRef: firebase.database().ref('Typing'),
    typingUsers: [],
    connectedRef: firebase.database().ref('.info/connected')
  }

  componentDidMount() {
    const { channel, user } = this.state;
    if(channel && user) {
      this.addListener(channel.id);
      this.addUserStarListener(channel.id, user.uid);
    }
  }

  componentDidUpdate() {
    if(this.messageEnd) {
      this.scrollToEnd()
    }
  }

  scrollToEnd = () => {
    this.messageEnd.scrollIntoView({ behavior: 'smooth' });
  }

  addListener = channelId => {
    this.addMessageListener(channelId);
    this.addTypingListener(channelId);
  }

  addTypingListener = channelId => {
    let typingUsers = [];
    this.state.typingRef.child(channelId).on('child_added', snap => {
      if(snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({ id: snap.key, avatar: snap.val() })
      }
      this.setState({ typingUsers })
    })

    this.state.typingRef.child(channelId).on('child_removed', snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key)
      if(index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key)
      }
      this.setState({ typingUsers })
    })

    this.state.connectedRef.on('value', snap => {
      if(snap.val() === true) {
        this.state.typingRef.child(channelId)
        .child(this.state.user.uid).onDisconnect()
        .remove(err => {if(err) console.error(err)})
      }
    })
  }

  addMessageListener = channelId => {
    let loadMessages = [];
    this.state.messageRef.child(channelId).on('child_added', snap => {
      loadMessages.push(snap.val());
      this.setState({ messages: loadMessages, messageLoading: false });
      this.countUniqueUsers(loadMessages);
      this.countUserPost(loadMessages);
    });
  }

  addUserStarListener = (channelId, userId) => {
    this.state.usersRef
    .child(userId).child('starred').once('value')
    .then(data => {
      if(!data.val()) return;
      const channelIds = Object.keys(data.val());
      const prevStarred = channelIds.includes(channelId);
      this.setState({ isStarChannel: prevStarred })
    })
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

  displayChannelName = channel => channel ? `${channel.name}` : '';

  displayTypingUsers = users => (
    users.length > 0 && users.map(user => (
      <Comment key={user.id}>
        <Comment.Avatar src={user.avatar} />
        <Comment.Content>        
          <Typing />
        </Comment.Content>
      </Comment>
    ))
  )

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

  countUserPost = messages => {
    let userPosts = messages.reduce((acc, message) => {
      if(message.user.name in acc) {
        acc[message.user.name].count += 1;
      } else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc;
    }, {});
    this.props.setUserPost(userPosts);
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

  toggleStarChannel = () => {
    this.setState(preState => (
      { isStarChannel: !preState.isStarChannel }
    ), this.starChannel)
  }

  starChannel = () => {
    if(this.state.isStarChannel) {
      this.state.usersRef
      .child(`${this.state.user.uid}/starred`)
      .update({
        [this.state.channel.id] : {
          name: this.state.channel.name,
          details: this.state.channel.details,
          createdBy: {
            name: this.state.channel.createdBy.name,
            avatar: this.state.channel.createdBy.avatar
          }
        }
      })
    } else {
      this.state.usersRef
      .child(`${this.state.user.uid}/starred`)
      .child(this.state.channel.id)
      .remove(err => { if(err) console.error(err) });
    }
  }

  render() {
    const { messageRef, messages, channel, user, progressBar, isStarChannel, typingUsers, 
      numUniqueUsers, searchTem, searchResults, searchLoading, messageLoading } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader 
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={this.props.isPrivateChannel}
          toggleStarChannel={this.toggleStarChannel}
          isStarChannel={isStarChannel}
        />

        <Segment loading={messageLoading}>
          <Comment.Group className={progressBar ? 'message__progress' : 'messages'}>
            { searchTem ? this.displayMessages(searchResults) : 
            this.displayMessages(messages)}
            {this.displayTypingUsers(typingUsers)}
            <div ref={node => (this.messageEnd = node)}></div>
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

export default connect(null, { setUserPost })(Messages);