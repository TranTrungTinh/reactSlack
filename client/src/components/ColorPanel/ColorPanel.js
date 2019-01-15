import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserColors } from '../../redux/actions';
import firebase from '../../firebase';
import { Sidebar, Menu, Divider, Button, Modal, Icon, Label, Segment } from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

class ColorPanel extends Component {

  state = {
    modal: false,
    primary: '',
    secondary: '',
    user: this.props.currentUser,
    usersRef: firebase.database().ref('Users'),
    userColors: []
  }

  componentDidMount() {
    if(this.state.user) this.addListener(this.state.user.uid);
  }

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChangePrimary = color => this.setState({ primary: color.hex });
  handleChangeSecondary = color => this.setState({ secondary: color.hex });

  handleSaveColors = () => {
    if(this.state.primary && this.state.secondary) {
      this.saveColors(this.state.primary, this.state.secondary);
    }
  }

  saveColors = (primaryColor, secondaryColor) => {
    this.state.usersRef
    .child(`${this.state.user.uid}/colors`)
    .push()
    .update({ primaryColor, secondaryColor })
    .then(() => this.closeModal())
    // .catch(err => console.error(err));
  }

  addListener = (userId) => {
    let userColors = [];
    this.state.usersRef
    .child(`${userId}/colors`)
    .on('child_added', snap => {
      userColors.unshift(snap.val());
      this.setState({ userColors });
    })
  }

  displayUserColors = (colors) => (
    colors.length > 0 && colors.map((color, i) => (
      <React.Fragment key={i}>
        <Divider />
        <div 
          className="color__container" 
          onClick={() => this.props.setUserColors(color.primaryColor, color.secondaryColor)}
        >
          <div className="color__square" style={{ background: color.primaryColor }}>
            <div className="color__overlay" style={{ background: color.secondaryColor }}></div>
          </div>
        </div>
      </React.Fragment>
    ))
  )

  render() {
    const { modal, primary, secondary, userColors } = this.state;
    return (
      <React.Fragment>
        <Sidebar
          as={Menu}
          icon="labeled"
          inverted
          vertical
          visible
          width="very thin"
        >
          <Divider />
          <Button icon="add" size="small" color="green" onClick={this.openModal}/>
          {this.displayUserColors(userColors)}
        </Sidebar>

        <Modal open={modal} onClose={this.closeModal}>
          <Modal.Header>Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment color='green'>
              <Label content="Primary colors" pointing="below" color="green"/>
              <SliderPicker 
                styles={{ default: { wrap: {} } }} 
                color={primary} 
                onChange={this.handleChangePrimary} 
              />
            </Segment>

            <Segment color='violet'>
              <Label content="Secondary colors" pointing="below" color="violet"/>
              <SliderPicker 
                styles={{ default: { wrap: {} } }} 
                color={secondary} 
                onChange={this.handleChangeSecondary} 
              />
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button.Group widths="2">
              <Button positive onClick={this.handleSaveColors}>
                <Icon name="checkmark"/>Save Colors
              </Button>
              <Button.Or />
              <Button negative onClick={this.closeModal}>
                <Icon name="remove"/>Cancel
              </Button>
            </Button.Group>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default connect(null, { setUserColors })(ColorPanel);
