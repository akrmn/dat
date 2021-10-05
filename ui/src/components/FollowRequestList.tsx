// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Icon, List } from 'semantic-ui-react'
import { Follows } from '@daml.js/dat';
import { ContractId, Party } from '@daml/types';

type IncomingFollowRequest = {
  requestId: ContractId<Follows.FollowRequest>;
  follower: Party
}

type Props = {
  requests: IncomingFollowRequest[];
  onAccept: (request: ContractId<Follows.FollowRequest>) => void;
  onDecline: (request: ContractId<Follows.FollowRequest>) => void;
}

/**
 * React component to display a list of `User`s.
 * Every party in the list can be added as a friend.
 */
const FollowRequestList: React.FC<Props> = ({ requests, onAccept, onDecline }) => {
  return (
    <List divided relaxed>
      {requests.sort((x, y) => x.follower.localeCompare(y.follower)).map(req =>
        <List.Item key={req.follower}>
          <List.Icon name='user' />
          <List.Content>
            <List.Content floated='right'>
              <Icon
                name='delete'
                link
                className='test-decline-follow-request'
                onClick={() => onDecline(req.requestId)} />
              <Icon
                name='check'
                link
                className='test-accept-follow-request'
                onClick={() => onAccept(req.requestId)} />
            </List.Content>
            <List.Header className='test-follow-request'>{req.follower}</List.Header>
          </List.Content>
        </List.Item>
      )}
    </List>
  );
};

export default FollowRequestList;
