import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import ColorPanel from './ColorPanel/ColorPanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetePanel';
import SidePanel from './SidePanel/SidePanel';

const App = ({ currentUser, currentChannel }) => (
  !currentUser ? (<Redirect to="/login"/>) :(
  <Grid className="app" style={{ background: '#eee' }}>
    <ColorPanel />
    <SidePanel 
      key={currentUser && currentUser.uid}
      currentUser={currentUser}
    />

    <Grid.Column style={{ marginLeft: 370 }} width="7" >
      <Messages 
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
      />
    </Grid.Column>

    <Grid.Column style={{ with: 4 }} width="4" >
      <MetaPanel />
    </Grid.Column>

  </Grid>
  )
)

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
});
export default connect(mapStateToProps)(App);

