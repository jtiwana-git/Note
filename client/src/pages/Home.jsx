import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../component/Button';

import { useQuery, gql } from '@apollo/client';

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

const Home = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_NOTES);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error!</p>;

  return (
    <div>
      {console.log(data)}
      The data loaded
    </div>
  );
};

export default Home;
