import React, { Component } from 'react';
import firebase from '../../firebase';

import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../redux/actions';

import { Menu, Icon } from 'semantic-ui-react';
import DirectUserItem from './DirectUserItem';

class DirectMessage extends Component {
  
  state = {
    activeChannel: '',
    user: this.props.currentUser,
    users: [],
    usersRef: firebase.database().ref('Users'),
    connectedRef: firebase.database().ref('.info/connected'),
    presenceRef: firebase.database().ref('presence')
  }

  componentDidMount() {
    if(this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  removeListeners = () => {
    this.state.usersRef.off();
    this.state.presenceRef.off();
    this.state.connectedRef.off();
  }

  addListeners = currentUserId => {
    let loadedUsers = [];
    this.state.usersRef.on('child_added', snap => {
      if(currentUserId !== snap.key) {
        const user = {
          ...snap.val(),
          uid: snap.key,
          status: 'offline'
        };
        loadedUsers.push(user);
        this.setState({ users: loadedUsers })
      }
    });

    this.state.connectedRef.on('value', snap => {
      if(snap.val() === true) {
        const ref = this.state.presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if(err) console.error(err)
        })
      }
    });

    this.state.presenceRef.on('child_added', snap => {
      if(currentUserId !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    this.state.presenceRef.on('child_removed', snap => {
      if(currentUserId !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  }

  addStatusToUser = (userId, connected = true) => {
    const updateUsers = this.state.users.reduce((acc, user) => {
      if(user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updateUsers });
  }

  displayDirectMessage = users => (
    users.map(user => (
      <DirectUserItem 
        key={user.uid} user={user} 
        changeChannel={this.changeChannel}
        activeChannel={this.state.activeChannel} 
      />
    ))
  )

  changeChannel = user => {
    const channelId = this.getChannelId(user.uid);
    const channel = {
      id: channelId,
      name: user.name
    };
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user.uid)
  }

  getChannelId = userId => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId ?
      `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
  }

  setActiveChannel = userId => {
    this.setState({ activeChannel: userId });
  }

  render() {
    const { users } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{'  '}({users.length})
        </Menu.Item>
        {this.displayDirectMessage(users)}
      </Menu.Menu>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessage);