import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

const isUserOnline = user => user.status === 'online' ? 'green' : 'red';

const DirectUserItem = ({ user, changeChannel, activeChannel }) => {
  return (
    <Menu.Item
      onClick={() => changeChannel(user)}
      style={{ opacity: 0.7, fontStyle: 'italic' }}
      active={user.uid === activeChannel}
    >
      <Icon 
        name='circle'
        color={isUserOnline(user)}
      />
      @ {user.name}
    </Menu.Item>
  )
}

export default DirectUserItem;
