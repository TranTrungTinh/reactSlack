import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../redux/actions';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

class Channels extends Component {
  state = {
    user: this.props.currentUser,
    activeChannel: '',
    channels: [],
    chanelName: '',
    chanelDetail: '',
    firebase: firebase.database().ref('Channels'),
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
    });
  }

  removeListeners = () => {
    this.state.firebase.off();
  }

  setFirstChannel = () => {
    const { firstLoad, channels } = this.state;
    const firstChannel = channels[0];
    if(firstLoad && channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ firstLoad: false });
    }
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  }

  channelChange = channel => {
    this.props.setCurrentChannel(channel);
    this.setActiveChannel(channel);
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
        # {channel.name}
      </Menu.Item>
    ))
  )

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: '2em' }}>
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
            <Button.Group>
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

export default connect(null, { setCurrentChannel })(Channels);

