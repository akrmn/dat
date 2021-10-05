import React from 'react'
import { Card, Image, Dropdown } from 'semantic-ui-react';
import { Token } from '@daml.js/dat';

type Props = {
  token: Token.Token
}

/**
 * React component displaying a token.
 */
const TokenCard: React.FC<Props> = ({ token }) => {
  return (
    <Card fluid>
      <Image src={token.content} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{token.title}</Card.Header>
        <Card.Meta>authored by {token.author} on {token.authoredOn}</Card.Meta>
        <Card.Description>{token.description}
          <Dropdown
            icon="history"
            floating
            scrolling
            direction="left"
            className="right floated"
          >
            <Dropdown.Menu>
              <Dropdown.Header>Transfer history</Dropdown.Header>
              {token.ownerHistory.map(entry =>
                <Dropdown.Item disabled>
                  {`${entry._1} ${entry._2}`}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Card.Description>
      </Card.Content>
    </Card>
  );
}

export default TokenCard;
