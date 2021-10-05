import React from 'react'
import { Card, Image, Dropdown, Button } from 'semantic-ui-react';
import { Token } from '@daml.js/dat';
import { useLedger, useParty } from '@daml/react';
import { v4 as uuid } from "uuid";

type Props = {
  token: Token.Token
}

/**
 * React component displaying a token.
 */
const TokenCard: React.FC<Props> = ({ token }) => {
  const myself = useParty();
  const [postIsSubmitting, setPostIsSubmitting] = React.useState(false);
  const [destroyIsSubmitting, setDestroyIsSubmitting] = React.useState(false);
  const ledger = useLedger();

  const handlePost = async (event: React.FormEvent) => {
    try {
      setPostIsSubmitting(true);
      await ledger.exerciseByKey(Token.Token.Token_SendPost, { author: token.author, id: token.id }, { postId: uuid() });
    } catch (error) {
      alert(`Error posting token:\n${JSON.stringify(error)}`);
    } finally {
      setPostIsSubmitting(false)
    }
  }

  const postButton =
    token.owner === myself &&
    <Button
      className='test-select-message-send-button'
      type="submit"
      disabled={postIsSubmitting}
      loading={postIsSubmitting}
      onClick={handlePost}
    >
      Post!
    </Button>

  const handleDestroy = async (event: React.FormEvent) => {
    try {
      setDestroyIsSubmitting(true);
      await ledger.exerciseByKey(Token.Token.Token_Destroy, { author: token.author, id: token.id }, {});
    } catch (error) {
      alert(`Error destroying token:\n${JSON.stringify(error)}`);
    } finally {
      setDestroyIsSubmitting(false)
    }
  }

  const destroyButton =
    token.owner === myself &&
    token.owner === token.author &&
    <Button
      negative
      className='test-select-message-send-button'
      type="submit"
      disabled={destroyIsSubmitting}
      loading={destroyIsSubmitting}
      onClick={handleDestroy}
    >
      Destroy!
    </Button>

  const buttons =
    <Button.Group
      attached="bottom"
      children={
        postButton ?
          destroyButton ?
            [postButton, <Button.Or />, destroyButton]
            :
            [postButton]
          :
          []
      }
    />

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
      {buttons}
    </Card>
  );
}

export default TokenCard;
