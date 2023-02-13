import React from 'react';
import { GET_NOTE } from '../utils/queries';
import Note from '../component/Note';
import { useQuery } from '@apollo/client';

const NotePage = (props) => {
  const id = props.match.params.id;

  const { loading, data, error } = useQuery(GET_NOTE, { variables: { id } });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Note not found</p>;

  return <Note note={data.note} />;
};

export default NotePage;
