import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../redux/actions';
import { Menu, Icon } from 'semantic-ui-react';

class Stars extends Component {
  state = {
    user: this.props.currentUser,
    usersRef: firebase.database().ref('Users'),
    activeChannel: '',
    starChannels: []
  }

  componentDidMount() {
    this.addListener(this.state.user.uid)
  }

  componentWillUnmount() {
    this.removeListeners()
  }

  removeListeners = () => {
    this.state.usersRef.child(`${this.state.user.uid}/starred`).off();
  }

  addListener = (userId) => {
    this.state.usersRef
    .child(userId)
    .child('starred')
    .on('child_added', snap => {
      const starredChannel = { id: snap.key, ...snap.val() };
      this.setState({ 
        starChannels: [...this.state.starChannels, starredChannel]
      });
    });

    this.state.usersRef
    .child(userId)
    .child('starred')
    .on('child_removed', snap => {
      const filterredChannels = this.state.starChannels.filter(channel => {
        return channel.id !== snap.key;
      });
      this.setState({ starChannels: filterredChannels });
    });
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  }

  channelChange = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  }

  displayChannels = starChannels => (
    starChannels.length > 0 && starChannels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        style={{ opacity: 0.7 }}
        onClick={() => this.channelChange(channel)}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ))
  )

  render() {
    const { starChannels } = this.state;
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name='heart'/> LOVE CHANNELS
          </span>{"  "}
          ({ starChannels.length })
        </Menu.Item>
        {this.displayChannels(starChannels)}
      </Menu.Menu>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Stars);