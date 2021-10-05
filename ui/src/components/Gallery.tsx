import React, { useMemo } from 'react'
import { Card, Divider, Dropdown } from 'semantic-ui-react';
import { Token } from '@daml.js/dat';
import { useParty, useStreamQueries } from '@daml/react';
import TokenCard from './TokenCard';
import { Party } from '@daml/types';

type Props = {
  following: Party[]
}

/**
 * React component displaying the list of tokens owned by a given user.
 */
const Gallery: React.FC<Props> = ({following}) => {
  const myself = useParty();
  const [selected, setSelected] = React.useState<Party>(myself);
  const tokens = useStreamQueries(Token.Token).contracts
    .map(x => x.payload)
    .filter(x => x.owner === selected)
    .sort((x, y) => x.ownerSince.localeCompare(y.ownerSince))
    .reverse()
    .map((token) => <TokenCard token={token}/>);

  const options = useMemo(() =>
    following
      .concat([myself])
      .sort((x, y) => x.localeCompare(y))
      .map(x=>({key:x, text:x, value:x})),
    [following, myself]);

  return (
    <div>
      <Dropdown
        selection
        placeholder="Select someone you follow"
        options={options}
        value={selected}
        onChange={event => setSelected(event.currentTarget.textContent ?? myself)}
      />
      <Divider />
      <Card.Group relaxed>
        {tokens}
      </Card.Group>
    </div>
  );
};

export default Gallery;
