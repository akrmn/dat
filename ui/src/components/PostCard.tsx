import React from 'react'
import { Card, Icon, Image, Dropdown, Button } from 'semantic-ui-react';
import { Token } from '@daml.js/dat';
import { useLedger, useParty } from '@daml/react';

type Props = {
  post: Token.Post
}

/**
 * React component displaying a post.
 */
const PostCard: React.FC<Props> = ({ post }) => {
  const myself = useParty();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const ledger = useLedger();
  const handleTake = async (event: React.FormEvent) => {
    try {
      setIsSubmitting(true);
      await ledger.exerciseByKey(Token.Post.Post_TakeToken, { sender: post.sender, id: post.id }, { newOwner: myself });
    } catch (error) {
      alert(`Error taking token:\n${JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Card fluid>
      <Card.Content extra>
        <>
          <Icon name='bullhorn' size='small' flipped='horizontally' />
          <span>{post.sender}</span>
        </>
        <div />
        <>
          <Icon name='clock' size='small' />
          <small>{post.timestamp}</small>
        </>
      </Card.Content>
      <Image src={post.token.content} wrapped ui={false} />
      <Card.Content>
        <Card.Header>{post.token.title}</Card.Header>
        <Card.Meta>authored by {post.token.author} on {post.token.authoredOn}</Card.Meta>
        <Card.Description>{post.token.description}
          <Dropdown
            icon="history"
            floating
            scrolling
            direction="left"
            className="right floated"
          >
            <Dropdown.Menu>
              <Dropdown.Header>Transfer history</Dropdown.Header>
              {post.token.ownerHistory.map(entry =>
                <Dropdown.Item disabled>
                  {`${entry._1} ${entry._2}`}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Card.Description>
      </Card.Content>
      <Button.Group attached="bottom">
        <Button
          className='test-select-message-send-button'
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          onClick={handleTake}
          content="Take!"
        />
      </Button.Group>
    </Card>
  );
}

export default PostCard;
