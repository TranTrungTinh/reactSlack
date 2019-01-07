import React from 'react';
import { Grid } from 'semantic-ui-react';
import './App.css';

import ColorPanel from './ColorPanel/ColorPanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetePanel';
import SidePanel from './SidePanel/SidePanel';

export default function App() {
  return (
    <Grid columns="equal" className="app" style={{ background: '#eee' }}>
      <ColorPanel />
      <SidePanel />

      <Grid.Column style={{ marginLeft: 320 }} >
        <Messages />
      </Grid.Column>

      <Grid.Column style={{ with: 4 }} >
        <MetaPanel />
      </Grid.Column>

    </Grid>
  )
}

