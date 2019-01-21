import React, { Component } from 'react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';
import { Grid, Header, Icon, Dropdown, Image, Modal, Button, Input } from 'semantic-ui-react';

export default class UserPanel extends Component {

  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    uploadedCroppedImage: '',
    blob: '',
    storageRef: firebase.storage().ref(),
    userRef: firebase.auth().currentUser,
    usersRef: firebase.database().ref('Users')
  }

  dropDownOptions = () => [
    {
      key: 'user',
      text: <span>Signed in as <strong>{this.state.user.displayName}</strong></span>,
      disabled: true
    },
    {
      key: 'avatar',
      text: <span onClick={this.openModal}>Change avatar</span>
    },
    {
      key: 'signout',
      text: <span onClick={this.signOutHandle}>Sign out</span>
    }
  ]

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if(file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result });
      })
    }
  }

  handleCropImage = () => {
    if(this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({ croppedImage: imageUrl, blob: blob });
      })
    }
  }

  uploadCroppedImage = () => {
    const { storageRef, userRef, blob } = this.state;
    storageRef.child(`avatar/user/${userRef.uid}`)
    .put(blob, { contentType: 'image/jpeg' })
    .then(snap => {
      snap.ref.getDownloadURL().then(downloadURL => {
        this.setState({ uploadedCroppedImage: downloadURL }, this.changeAvatar)
      })
    })
  }

  changeAvatar = () => {
    this.state.userRef
    .updateProfile({
      photoURL: this.state.uploadedCroppedImage
    })
    .then(() => this.closeModal())
    .catch(err => console.error(err))

    this.state.usersRef
    .child(this.state.user.uid)
    .update({ avatar: this.state.uploadedCroppedImage })
    .then(() => console.log('User avatar update'))
    .catch(err => console.error(err))
  }

  signOutHandle = () => {
    firebase.auth().signOut()
    .then(() => console.log('signed out'))
  }

  render() {
    const { user, modal, previewImage, croppedImage } = this.state;
    const { color } = this.props;
    
    return (
      <Grid style={{ background: color.primaryColor }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.25em', margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="paper plane"/>
              <Header.Content>DevChat</Header.Content>
            </Header>

            <Header inverted style={{ padding: '0.25em' }} as="h4">
              <Dropdown 
                trigger={
                  <span>
                    <Image avatar spaced src={ user.photoURL } />
                    {user.displayName}
                  </span>
                } 
                options={this.dropDownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>

        <Modal open={modal} onClose={this.closeModal}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input 
              fluid
              name="previewImage"
              type="file"
              label="Change avatar: jpg || png"
              onChange={this.handleChange}
            />
            <Grid centered stackable columns="2">
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  { previewImage && (
                    <AvatarEditor 
                      ref={node => (this.avatarEditor = node)}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  { croppedImage && (
                    <Image 
                      style={{ margin: '3.5em auto' }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    />)}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button.Group widths="3">
              { croppedImage && (
              <Button positive onClick={this.uploadCroppedImage}>
                <Icon name="save"/>Save avatar
              </Button>)}
              <Button color="yellow" onClick={this.handleCropImage}>
                <Icon name="image"/>Preview avatar
              </Button>
              <Button negative onClick={this.closeModal}>
                <Icon name="remove"/>Cancel
              </Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </Grid>
    )
  }
}
