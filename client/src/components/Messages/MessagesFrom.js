import React, { Component } from 'react';
import firebase from '../../firebase';
import uuid from 'uuid/v4';
import { Segment, Button, Input } from 'semantic-ui-react';
import { Picker, emojiIndex } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

export default class MessagesFrom extends Component {

  state = {
    storageRef: firebase.storage().ref(),
    uploadState: '',
    uploadTask: null,
    percentUploaded: 0,
    message: '',
    user: this.props.currentUser,
    channel: this.props.currentChannel,
    loading: false,
    modal: false,
    errors: [],
    emojiPiker: false
  }

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  createMessage = (fileUrl = null) => {
    const { user } = this.state;
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      }
    }
    if(fileUrl !== null) message['image'] = fileUrl;
    else message['content'] = this.state.message;
    return message;
  }

  sendMessage = () => {
    const { messageRef } = this.props;
    const { message, channel, errors } = this.state;
    if(message) {
      this.setState({ loading: true });
      messageRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => this.setState({ loading: false, message: '', errors: [] }))
        .catch(err => this.setState({ loading: false, errors: errors.concat(err) }));
    } else {
      this.setState({ errors: errors.concat({message: 'Please add a message...'}) })
    }
  }

  displayStatusMessage = errors => (
    errors.some(error => error.message.includes('message')) ? 'error' : ''
  )

  toggleEmoji = () => {
    this.setState({ emojiPiker: !this.state.emojiPiker });
  }

  handleAddEmoji = emoji => {
    const oldMessage = this.state.message;
    const newMessage = this.colonToUnicode(`${oldMessage}${emoji.colons}`);
    console.log(emoji);
    console.log(newMessage);
    this.setState({ message: newMessage });
    setTimeout(() => {this.messageInputRef.focus()}, 0);
  }

  colonToUnicode = message => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, x => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if(typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if(typeof unicode !== "undefined") {
          return unicode;
        } 
      }
      x = ":" + x + ":";
      return x;
    });
  }

  uploadFile = (file, metadata) => {
    const pathToUpLoad = this.state.channel.id;
    const ref = this.props.messageRef;
    const filePath = `chat/public/${uuid()}.jpg`;

    this.setState({ 
      uploadState: 'uploading',
      uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
    }, () => this.uploadProgress(ref, pathToUpLoad))
  }

  uploadProgress = (ref, pathToUpLoad) => {
    this.state.uploadTask.on('state_changed', snap => {
      const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      this.props.isProgressBarVisible(percentUploaded);
      this.setState({ percentUploaded });
    }, 
      (error) => this.uploadError(error),
      () => this.startedUploadFile(ref, pathToUpLoad)
    )
  }

  uploadError = (error) => {
    this.setState({ 
      errors: this.state.errors.concat(error),
      uploadState: 'error',
      uploadTask: null 
    })
  }

  startedUploadFile = (ref, pathToUpLoad) => {
    this.state.uploadTask.snapshot.ref.getDownloadURL()
    .then(downloadURL => this.sendFileMessage(downloadURL, ref, pathToUpLoad))
    .catch(this.uploadError)
  }

  sendFileMessage = (filePath, ref, pathToUpLoad) => {
    ref.child(pathToUpLoad)
    .push()
    .set(this.createMessage(filePath))
    .then(() => this.setState({ uploadState: 'done' }))
    .catch(error => {
      this.setState({ errors: this.state.errors.concat(error) })
    })
  }

  
  render() {
    const { errors, message, loading, 
      modal, uploadState, percentUploaded, emojiPiker } = this.state;
    return (
      <Segment className="message__form">
        {emojiPiker && (
          <Picker 
            set="apple"
            onSelect={this.handleAddEmoji}
            className="emojipicker"
            title="Pick your emoji"
            emoji="point_up"
          />
        )}
        <Input 
          fluid
          name="message"
          value={message}
          ref={node => (this.messageInputRef = node)}
          style={{ marginBottom: '0.7em' }}
          label={
            <Button 
              icon={emojiPiker ? "close" : 'add'}
              content={emojiPiker ? 'Close' : null} 
              onClick={this.toggleEmoji}
            
            />}
          labelPosition="left"
          placeholder="Write your message"
          onChange={this.handleChange}
          className={this.displayStatusMessage(errors)}
        />

        <Button.Group icon widths="2">
          <Button 
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            disabled={loading}
          />
          <Button 
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            disabled={uploadState === 'uploading'}
            onClick={this.openModal}
          />
        </Button.Group>
          <FileModal 
            modal={modal} 
            onCloseModal={this.closeModal} 
            onUploadFile={this.uploadFile}
          />
          <ProgressBar 
            uploadState={uploadState}
            percentUploaded={percentUploaded}
          />
      </Segment>
    )
  }
}
