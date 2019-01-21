import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../redux/actions';
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    activeChannel: '',
    channel: null,
    channels: [],
    chanelName: '',
    chanelDetail: '',
    firebase: firebase.database().ref('Channels'),
    messageRef: firebase.database().ref('Messages'),
    typingRef: firebase.database().ref('Typing'),
    notifications: [],
    modal: false,
    firstLoad: true
  }

  componentDidMount() {
    this.addChannelListener()
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  closeModel = () => { this.setState({ modal: false }) };
  openModel = () => { this.setState({ modal: true }) };

  handleChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();
    if(!this.isFormValid(this.state)) return;
    this.addChannel();
  }

  isFormValid = ({ chanelName, chanelDetail }) => chanelName && chanelDetail;

  addChannel = () => {
    const { user, chanelDetail, chanelName, firebase } = this.state;
    const newChannel = {
      name: chanelName,
      details: chanelDetail,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    }
    firebase.push(newChannel)
    .then(() => {
      this.setState({ chanelDetail: '', chanelName: '' });
      this.closeModel();
    })
    .catch(err => console.error(err));
  }

  addChannelListener = () => {
    let loadchannels = [];
    this.state.firebase.on('child_added', snap => {
      loadchannels.push({...snap.val(), id: snap.key});
      this.setState({ channels: loadchannels }, this.setFirstChannel);
      this.addNotificationListener(snap.key);
    });
  }

  addNotificationListener = channelId => {
    this.state.messageRef.child(channelId).on('value', snap => {
      if(!this.state.channel) return;
      this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
    })
  }

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {
    let lastTotal = 0;
    let index = notifications.findIndex(noti => noti.id === channelId);
    if(index !== -1) {
      if(channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if(snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0 
      })
    }
    this.setState({ notifications });
  }

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      noti => this.state.channel.id === noti.id);
    if(index !== -1) {
      let updateNotifications = [...this.state.notifications];
      updateNotifications[index].total = this.state.notifications[index].lastKnownTotal;
      updateNotifications[index].count = 0;
      this.setState({ notifications: updateNotifications });
    }
  }

  getNotificationCount = channel => {
    let count = 0;
    this.state.notifications.forEach(noti => {
      if(noti.id === channel.id) {
        count = noti.count
      }
    });
    if(count > 0) return count;
  }

  removeListeners = () => {
    this.state.firebase.off();
    this.state.channels.forEach(channel => {
      this.state.messageRef.child(channel.id).off()
    })
  }

  setFirstChannel = () => {
    const { firstLoad, channels } = this.state;
    const firstChannel = channels[0];
    if(firstLoad && channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ firstLoad: false, channel: firstChannel });
    }
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  }

  channelChange = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.state.typingRef.child(channel.id).child(this.state.user.uid).remove();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
  }

  displayChannels = channels => (
    channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        name={channel.name}
        style={{ opacity: 0.7 }}
        onClick={() => this.channelChange(channel)}
        active={channel.id === this.state.activeChannel}
      >
        {this.getNotificationCount(channel) && (
          <Label color="red">{this.getNotificationCount(channel)}</Label>
        )}
        # {channel.name}
      </Menu.Item>
    ))
  )

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name='exchange'/> CHANNELS
            </span>{" "}
            ({ channels.length })<Icon name='add' link onClick={this.openModel}/>
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>

        <Modal open={modal} onClose={this.closeModel}>
          <Modal.Header>Add new channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input 
                  fluid
                  name="chanelName"
                  label="Name of channel"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input 
                  fluid
                  name="chanelDetail"
                  label="About the channel"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button.Group widths="2">
              <Button positive onClick={this.handleSubmit}>
                <Icon name="checkmark"/>Save
              </Button>
              <Button.Or />
              <Button negative onClick={this.closeModel}>
                <Icon name="remove"/>Cancel
              </Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>

      </React.Fragment>
    )
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);

