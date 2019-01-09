import React, { Component } from 'react';
import { Segment, Comment } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesFrom';

export default class Messages extends Component {
  render() {
    return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">

          </Comment.Group>
        </Segment>

        <MessagesForm />
      </React.Fragment>
    )
  }
}
