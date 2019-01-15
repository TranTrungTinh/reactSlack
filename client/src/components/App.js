import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ColorPanel from './ColorPanel/ColorPanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetePanel';
import SidePanel from './SidePanel/SidePanel';

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts, color }) => (
  !currentUser ? (<Redirect to="/login"/>) :(
  <Grid className="app" style={{ background: color.secondaryColor }}>
    <ColorPanel 
      key={currentUser && currentUser.name}    
      currentUser={currentUser}
    />
    <SidePanel 
      key={currentUser && currentUser.uid}
      currentUser={currentUser}
      color={color}
    />

    <Grid.Column style={{ marginLeft: 370 }} width="8">
      <Messages 
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel}
      />
    </Grid.Column>

    <Grid.Column width="4" >
      <MetaPanel 
        key={currentChannel && currentChannel.name}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
        userPosts={userPosts}
      />
    </Grid.Column>

  </Grid>
  )
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPosts: state.channel.userPosts,
  color: state.color
});
export default connect(mapStateToProps)(App);

