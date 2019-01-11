import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

const isUserOnline = user => user.status === 'online' ? 'green' : 'red';

export default function DirectUserItem({ user, changeChannel }) {
  return (
    <Menu.Item
      onClick={() => changeChannel(user)}
      style={{ opacity: 0.7, fontStyle: 'italic' }}
    >
      <Icon 
        name='circle'
        color={isUserOnline(user)}
      />
      @ {user.name}
    </Menu.Item>
  )
}
