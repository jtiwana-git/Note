import React from 'react';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

import styled from 'styled-components';

const StyledNote = styled.article`
  max-width: 800px;
  margin: 0 auto;
`;

const MetaData = styled.div`
@media (min-width: 500px) {
  display: flex;
  align-items: top:
};`;

const MetaInfo = styled.div`
  padding-right: 1em;
`;

const UserActions = styled.div`
  margin-left: auto;
`;

const Note = ({ note }) => {
  return (
    <StyledNote>
      <MetaData>
        <MetaInfo>
          <img
            src={note.author.avatar}
            alt="{note.author.username} avatar"
            height="50px"
          />{' '}
        </MetaInfo>
        <MetaInfo>
          <em>by</em> {note.author.username} <br />
          {moment(note.createdAt).format('DD MMMM YYYY [at] hh:mm a')}{' '}
        </MetaInfo>
        <UserActions>
          <em>Favorites:</em> {note.favoriteCount}
        </UserActions>
      </MetaData>
      <ReactMarkdown source={note.content} />
    </StyledNote>
  );
};

export default Note;
