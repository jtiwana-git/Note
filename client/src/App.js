import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';

import { setContext } from '@apollo/client/link/context';

import GlobalStyle from './component/GlobalStyle';
import Layout from './component/Layout';
import Home from './pages/Home';
import MyNotes from './pages/MyNotes';
import Favorites from './pages/Favorites';
import NotePage from './pages/NotePage';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <GlobalStyle />
        <Layout>
          <Routes>
            <Route path="/mynotes" element={<MyNotes />} />
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/note/:id" element={<NotePage />} />
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </Layout>
      </Router>
    </ApolloProvider>
  );
}

export default App;
