import React from 'react'
import { Card, Icon, Image, Dropdown } from 'semantic-ui-react';
import { Token } from '@daml.js/dat';

type Props = {
  post: Token.Post
}

/**
 * React component displaying a post.
 */
const PostCard: React.FC<Props> = ({ post }) => {
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
    </Card>
  );
}

export default PostCard;
