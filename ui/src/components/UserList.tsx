// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Icon, List } from 'semantic-ui-react'
import { Party } from '@daml/types';

type Props = {
  users: Party[];
  following: Party[];
  onFollow: (userToFollow: Party) => void;
  onRemove: (userToFollow: Party) => void;
}

/**
 * React component to display a list of `User`s.
 * Every party in the list can be added as a friend.
 */
const UserList: React.FC<Props> = ({users, following, onFollow, onRemove}) => {
  return (
    <List divided relaxed>
      {[...users].sort((x, y) => x.localeCompare(y)).map(user =>
        <List.Item key={user}>
          <List.Icon name='user' />
          <List.Content>
            <List.Content floated='right'>
            <Icon
                name='delete'
                link
                className='test-remove-follower-icon'
                onClick={() => onRemove(user)} />
              <Icon
                name='add user'
                link
                className='test-select-add-user-icon'
                disabled={following.includes(user)}
                onClick={() => onFollow(user)} />
            </List.Content>
            <List.Header className='test-select-user-in-network'>{user}</List.Header>
          </List.Content>
        </List.Item>
      )}
    </List>
  );
};

export default UserList;
