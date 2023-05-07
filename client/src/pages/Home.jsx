import React from 'react';

import NoteFeed from '../component/NoteFeed';
import Button from '../component/Button';
import { useQuery } from '@apollo/client';
import { GET_NOTES } from '../utils/queries';

const Home = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_NOTES);
  // // Data is undefined, loading is true, error is undefined
  if (loading) return <p>Loading...</p>;
  console.log(loading);

  // if (error) return <p>Error!</p>;
  // console.log(data);
  // console.log(GET_NOTES);

  return (
    <h1>HOME</h1>
    // <React.Fragment>
    //   {console.log(data)}
    //   <NoteFeed notes={data.noteFeed} />
    //   {data.noteFeed.HasNextPage && (
    //     <Button
    //       onClick={() =>
    //         fetchMore({
    //           variables: {
    //             cursor: data.noteFeed.cursor,
    //           },
    //           updateQuery: (previousResult, { fetchMoreResult }) => {
    //             return {
    //               noteFeed: {
    //                 cursor: fetchMoreResult.noteFeed.cursor,
    //                 HasNextPage: fetchMoreResult.noteFeed.HasNextPage,
    //                 notes: [
    //                   ...previousResult.noteFeed.notes,
    //                   ...fetchMoreResult.noteFeed.notes,
    //                   console.log('cursor (Front)' + data.noteFeed.cursor),
    //                 ],
    //                 __typename: 'noteFeed',
    //               },
    //             };
    //           },
    //         })
    //       }
    //     >
    //       Load more...
    //     </Button>
    //   )}
    // </React.Fragment>
  );
};

export default Home;
