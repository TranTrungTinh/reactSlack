import React, { Component } from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

export default class Channels extends Component {
  state = {
    channels: [],
    chanelName: '',
    chanelDetail: '',
    modal: false
  }

  closeModel = () => { this.setState({ modal: false }) };
  openModel = () => { this.setState({ modal: true }) };

  handleChange = event => {
    this.setState({ [event.target.name] : event.target.value });
  }

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
        </Menu.Menu>

        <Modal open={modal} onClose={this.closeModel}>
          <Modal.Header>Add new channel</Modal.Header>
          <Modal.Content>
            <Form>
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
              <Button positive>
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

