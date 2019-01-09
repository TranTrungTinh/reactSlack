import React, { Component } from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

export default class MessagesHeader extends Component {
  render() {
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }} >
          <span>
            Channel
            <Icon name="heart outline" color="red" />
          </span>
          <Header.Subheader>3 Users</Header.Subheader>
        </Header>

        <Header floated="right">
          <Input 
            size="mini"
            icon="search"
            name="searchItem"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    )
  }
}
