import { Link } from 'react-router-dom';
import React from 'react';
import Note from './Note';
import styled from 'styled-components';

const NoteWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  boarder-bottom: 1px solid #f5f4f0;
`;

const NoteFeed = ({ notes }) => {
  return (
    <div>
      {notes.map((note) => (
        <NoteWrapper key={note.id}>
          <Link to={`note/${note.id}`}>Permalink</Link>
        </NoteWrapper>
      ))}
    </div>
  );
};

export default NoteFeed;
