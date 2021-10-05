import React from 'react'
import { Card } from 'semantic-ui-react';
import { Token } from '@daml.js/dat';
import { useParty, useStreamQueries } from '@daml/react';
import PostCard from './PostCard';
import { Party } from '@daml/types';

type Props = {
  following: Party[];
}

/**
 * React component displaying the list of posts visible to the current user.
 */
const PostList: React.FC<Props> = ({following}) => {
  const myself = useParty();
  const tweets = useStreamQueries(Token.Post).contracts
    .map(x => x.payload)
    .filter(({sender}) => following.includes(sender) || sender === myself)
    .sort((x, y) => x.timestamp.localeCompare(y.timestamp))
    .reverse()
    .map((post) => <PostCard post={post}/>);

  return (
    <Card.Group relaxed>
      {tweets}
    </Card.Group>
  );
};

export default PostList;
