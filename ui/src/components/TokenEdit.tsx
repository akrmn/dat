import React from 'react'
import { Form, Button } from 'semantic-ui-react';
import { User } from '@daml.js/dat';
import { useParty, useLedger } from '@daml/react';
import {v4 as uuid} from "uuid";

/**
 * React component to mint a token.
 */
const TokenEdit: React.FC = () => {
  const sender = useParty();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const ledger = useLedger();

  const submitMessage = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      setIsSubmitting(true);
      const token = {
        tokenId: uuid(),
        title,
        content,
        description,
      }
      await ledger
        .exerciseByKey(User.User.MintToken, sender, token)
      setTitle("");
      setContent("");
      setDescription("");
    } catch (error) {
      alert(`Error sending tweet:\n${JSON.stringify(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form onSubmit={submitMessage}>
      <Form.Input
        className='test-select-message-content'
        placeholder="The title of your token"
        value={title}
        onChange={event => setTitle(event.currentTarget.value)}
      />
      <Form.Input
        className='test-select-message-content'
        placeholder="The URL to mint"
        value={content}
        onChange={event => setContent(event.currentTarget.value)}
      />
      <Form.Input
        className='test-select-message-content'
        placeholder="Write a description"
        value={description}
        onChange={event => setDescription(event.currentTarget.value)}
      />
      <Button
        fluid
        className='test-select-message-send-button'
        type="submit"
        disabled={isSubmitting || content === ""}
        loading={isSubmitting}
        content="Mint!"
      />
    </Form>
  );
};

export default TokenEdit;
