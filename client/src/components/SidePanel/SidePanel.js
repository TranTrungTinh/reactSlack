import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react';
import UserPanel from './UserPanel';

export default class SidePanel extends Component {
  render() {
    return (
      <Menu 
        inverted size="large" fixed="left" vertical 
        style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
      >
        <UserPanel />
      </Menu>
    )
  }
}