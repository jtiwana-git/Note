import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import NoteForm from '../component/NoteForm';
import { NEW_NOTE } from '../utils/mutations';

const New = (props) => {
  useEffect(() => {
    document.title = 'New Note — Notedly';
  });

  const [data, { loading, error }] = useMutation(NEW_NOTE, {
    onCompleted: (data) => {
      // When complete, redirect user to the note page
      props.push(`/note/${data.newNote.id}`);
      console.log(data);
    },
  });

  return (
    <React.Fragment>
      {loading && <p>Loading...</p>}
      {error && <p>Error saving the note</p>}
      <NoteForm action={data} />
    </React.Fragment>
  );
};

export default New;
