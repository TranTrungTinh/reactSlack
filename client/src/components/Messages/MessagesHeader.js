import React, { Component } from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

export default class MessagesHeader extends Component {
  render() {
    const { channelName, numUniqueUsers, toggleStarChannel, isStarChannel,
      handleSearchChange, searchLoading, isPrivateChannel } = this.props;
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }} >
          <span>
            { isPrivateChannel ? `@${channelName}` : `#${channelName}`}
            {!isPrivateChannel && (
            <Icon 
              link 
              onClick={toggleStarChannel}
              name={isStarChannel ? "heart" : "heart outline"} 
              color={isStarChannel ? "red" : "black"}
            />)}
          </span>
          <Header.Subheader>{numUniqueUsers}</Header.Subheader>
        </Header>

        <Header floated="right">
          <Input 
            loading={searchLoading}
            onChange={handleSearchChange}
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

