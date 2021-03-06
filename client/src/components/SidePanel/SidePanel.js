import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessage from './DirectMessage';
import Stars from './Stars';

export default class SidePanel extends Component {
  render() {
    const { currentUser, color } = this.props;
    return (
      <Menu 
        inverted size="huge" fixed="left" vertical 
        style={{ background: color.primaryColor, fontSize: '1.2rem' }}
      >
        <UserPanel color={color} currentUser={currentUser}/>
        <Stars currentUser={currentUser} />
        <Channels currentUser={currentUser}/>
        <DirectMessage currentUser={currentUser}/>
      </Menu>
    )
  }
}
