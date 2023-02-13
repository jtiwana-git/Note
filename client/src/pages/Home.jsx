import React from 'react';

import NoteFeed from '../component/NoteFeed';
import Button from '../component/Button';
import { GET_NOTES } from '../utils/queries';
import { useQuery } from '@apollo/client';

const Home = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_NOTES);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error!</p>;

  return (
    <React.Fragment>
      <NoteFeed notes={data.noteFeed.notes} />
      {data.noteFeed.HasNextPage && (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                cursor: data.noteFeed.cursor,
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                return {
                  noteFeed: {
                    cursor: fetchMoreResult.noteFeed.cursor,
                    HasNextPage: fetchMoreResult.noteFeed.HasNextPage,
                    notes: [
                      ...previousResult.noteFeed.notes,
                      ...fetchMoreResult.noteFeed.notes,
                    ],
                    __typename: 'noteFeed',
                  },
                };
              },
            })
          }
        >
          Load more...
        </Button>
      )}
    </React.Fragment>
  );
};

export default Home;
