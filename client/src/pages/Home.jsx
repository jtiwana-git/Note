import React from 'react';

import NoteFeed from '../component/NoteFeed';
import { GET_NOTES } from '../utils/queries';
import { useQuery } from '@apollo/client';

const Home = () => {
  const { data, loading, error, fetchMore } = useQuery(GET_NOTES);

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error!</p>;

  return <NoteFeed notes={data.noteFeed.notes} />;
};

export default Home;
