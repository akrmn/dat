// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { ContractId, Party } from '@daml/types';
import { User, Follows } from '@daml.js/dat';
import { useParty, useLedger, useStreamFetchByKeys, useStreamQueries } from '@daml/react';
import FollowRequestList from './FollowRequestList';
import Gallery from './Gallery';
import PartyListEdit from './PartyListEdit';
import PostList from './PostList';
import TokenEdit from './TokenEdit';
import UserList from './UserList';

const MainView: React.FC = () => {
  const username = useParty();
  const myUserResult = useStreamFetchByKeys(User.User, () => [username], [username]);
  const myUser = myUserResult.contracts[0]?.payload;
  const allFollows = useStreamQueries(Follows.Follows).contracts;
  const allFollowRequests = useStreamQueries(Follows.FollowRequest).contracts;

  const ledger = useLedger();

  const follow = async (userToFollow: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(User.User.RequestToFollow, username, { userToFollow });
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const unfollow = async (userToUnfollow: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(Follows.Follows.Unfollow, { follower: username, followee: userToUnfollow }, {});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const withdrawRequest = async (userToFollow: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(Follows.FollowRequest.WithdrawFollowRequest, { follower: username, followee: userToFollow }, {});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const removeFollower = async (userToRemove: Party): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(Follows.Follows.RemoveFollower, { followee: username, follower: userToRemove }, {});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const onAcceptFollowRequest = async (followRequestToAccept: ContractId<Follows.FollowRequest>): Promise<boolean> => {
    try {
      await ledger.exercise(Follows.FollowRequest.AcceptFollowRequest, followRequestToAccept, {})
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  const onDeclineFollowRequest = async (followRequestToDecline: ContractId<Follows.FollowRequest>): Promise<boolean> => {
    try {
      await ledger.exercise(Follows.FollowRequest.DeclineFollowRequest, followRequestToDecline, {})
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  // Sorted list of users that are following the current user
  const followers = useMemo(() =>
    allFollows
      .filter(follows => follows.payload.followee === username)
      .map(follows => follows.payload.follower)
      .sort((x, y) => x.localeCompare(y)),
    [allFollows, username]);

  const following = useMemo(() =>
    allFollows
      .filter(follows => follows.payload.follower === username)
      .flatMap(follows => follows.payload.followee)
      .sort(),
    [allFollows, username]);

  const incomingFollowRequests = useMemo(() =>
    allFollowRequests
      .map(req => ({
        requestId: req.contractId,
        follower: req.payload.follows.follower,
        followee: req.payload.follows.followee,
      }))
      .filter(req => req.followee === username),
    [allFollowRequests, username]);

  const outgoingFollowRequests = useMemo(() =>
    allFollowRequests
      .map(req => ({
        requestId: req.contractId,
        follower: req.payload.follows.follower,
        followee: req.payload.follows.followee,
      }))
      .filter(req => req.follower === username),
    [allFollowRequests, username]);

  return (
    <Container>
      <Header as='h1' size='huge' color='blue' textAlign='center' style={{ padding: '1ex 0em 0ex 0em' }}>
        {myUser ? `Welcome, ${myUser.username}!` : 'Loading...'}
      </Header>
      <Grid centered columns={3}>
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <Header as='h2'>
                <Icon name='user' />
                <Header.Content>
                  {myUser?.username ?? 'Loading...'}
                  <Header.Subheader>Users I'm following</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PartyListEdit
                parties={following}
                pendingParties={outgoingFollowRequests.map((r) => r.followee)}
                onAddParty={follow}
                onWithdrawRequest={withdrawRequest}
                onUnfollow={unfollow}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='globe' />
                <Header.Content>
                  The Network
                  <Header.Subheader>My followers and users they are following</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <UserList
                users={followers}
                following={following}
                onFollow={follow}
                onRemove={removeFollower}
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='user plus' />
                <Header.Content>
                  Follow Requests
                  <Header.Subheader>My incoming follow requests</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <FollowRequestList
                requests={incomingFollowRequests}
                onAccept={onAcceptFollowRequest}
                onDecline={onDeclineFollowRequest}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <Header as='h2'>
                <Icon name='list alternate' />
                <Header.Content>
                  Timeline
                  <Header.Subheader>People you follow have posted these tokens...</Header.Subheader>
                </Header.Content>
              </Header>
              <Divider />
              <PostList
                following={following}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column >
            <Segment>
              <Header as='h2'>
                <Icon name='leaf' />
                <Header.Content>
                  Mint
                  <Header.Subheader>Create a token</Header.Subheader>
                </Header.Content>
              </Header>
              <TokenEdit
              />
            </Segment>
            <Segment>
              <Header as='h2'>
                <Icon name='images' />
                <Header.Content>
                  Gallery
                  <Header.Subheader>See your and your friends' tokens</Header.Subheader>
                </Header.Content>
              </Header>
              <Gallery
                following={following}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default MainView;
