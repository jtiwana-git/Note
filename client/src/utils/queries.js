import { gql } from '@apollo/client';

export const GET_NOTES = gql`
  query Me($cursor: String) {
    noteFeed(cursor: $cursor) {
      cursor
      hasNextPage
      notes {
        id
        createdAt
        content
        favoriteCount
        author {
          username
          id
          avatar
        }
      }
    }
  }
`;

export const GET_NOTE = gql`
  query Note($noteId: ID) {
    note(id: $noteId) {
      id
      createdAt
      favoriteCount
      author {
        username
        id
        avatar
      }
    }
  }
`;
