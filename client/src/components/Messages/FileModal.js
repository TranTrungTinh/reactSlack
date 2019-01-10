import React, { Component } from 'react';
import mime from 'mime-types';
import { Modal, Input, Form, Button, Icon } from 'semantic-ui-react';

export default class FileModal extends Component {

  state = {
    file: null,
    authorized: ['image/jpeg', 'image/png']
  }

  addFile = event => {
    const file = event.target.files[0];
    if(file) this.setState({ file });
  }

  sendFile = () => {
    const { file } = this.state;
    if(file === null) return;
    if(this.isAuthorizred(file.name)) {
      const metadata = { contentType: mime.lookup(file.name) };
      this.props.onUploadFile(file, metadata);
      this.props.onCloseModal();
      this.clearFile();
    }
  }

  isAuthorizred = filename => this.state.authorized.includes(mime.lookup(filename));
  clearFile = () => { this.setState({ file: null }) }

  render() {
    const { modal, onCloseModal } = this.props;
    return (
      <Modal open={modal} onClose={onCloseModal}>
        <Modal.Header>Select an Image file</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <Input 
                fluid
                name="file"
                type="file"
                label="Choose image: jpg || png"
                onChange={this.addFile}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group widths="2">
            <Button positive onClick={this.sendFile}>
              <Icon name="checkmark"/>Yes
            </Button>
            <Button.Or />
            <Button negative onClick={onCloseModal}>
              <Icon name="remove"/>Cancel
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    )
  }
}
