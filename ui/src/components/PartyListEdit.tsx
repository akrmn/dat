// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Form, List, Button } from 'semantic-ui-react';
import { Party } from '@daml/types';

type Props = {
  parties: Party[];
  pendingParties: Party[];
  onAddParty: (party: Party) => Promise<boolean>;
}

/**
 * React component to edit a list of `Party`s.
 */
const PartyListEdit: React.FC<Props> = ({ parties, pendingParties, onAddParty }) => {
  const [newParty, setNewParty] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addParty = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsSubmitting(true);
    const success = await onAddParty(newParty);
    setIsSubmitting(false);
    if (success) {
      setNewParty('');
    }
  }

  const allParties =
    parties.map((p) => ({ party: p, pending: false })).concat(
      pendingParties.map((p) => ({ party: p, pending: true }))
    ).sort((x, y) => x.party.localeCompare(y.party))

  return (
    <List relaxed>
      {allParties.map(({ party, pending }) =>
        <List.Item
          key={party}
        >
          <List.Icon name='user outline' />
          <List.Content>
            <List.Header className='test-select-following'>
              {party}
            </List.Header>
          </List.Content>
          {pending &&
            <List.Icon name='hourglass outline' />
          }
        </List.Item>
      )}
      <br />
      <Form onSubmit={addParty}>
        <Form.Input
          fluid
          readOnly={isSubmitting}
          loading={isSubmitting}
          className='test-select-follow-input'
          placeholder="Username to follow"
          value={newParty}
          onChange={(event) => setNewParty(event.currentTarget.value)}
        />
        <Button
          type='submit'
          className='test-select-follow-button'>
          Request to Follow
        </Button>
      </Form>
    </List>
  );
};

export default PartyListEdit;
