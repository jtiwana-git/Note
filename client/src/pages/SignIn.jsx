import React from 'react';
import { useEffect } from 'react';
import { SIGN_IN } from '../utils/mutations';
import { useMutation, useApolloClient } from '@apollo/client';
import styled from 'styled-components';
import Auth from '../utils/auth';
import UserForm from '../component/UserForm';

const Wrapper = styled.div`
  border: 1px solid #f5f4f0;
  max-width: 600px;
  padding-top: 10px;
  margin: 0 auto;
  margin-left: 200px;
  background-color: #f5f4f0;
`;

const Form = styled.form`
  label,
  input {
    display: block;
    line-height: 2em;
  }
  input {
    width: 100%;
    margin-bottom: 1em;
  }
`;

const SignIn = (props) => {
  useEffect(() => {
    document.title = 'Log in';
  });

  const client = useApolloClient();

  const [signIn, { loading, error }] = useMutation(SIGN_IN, {
    onCompleted: (data) => {
      Auth.login(data.signIn.token);
      client.writeData({ data: { isLoggedIn: true } });
      console.log('User ' + data.username);
    },
  });

  return (
    <Wrapper>
      <React.Fragment>
        <UserForm action={signIn} formType="signIn" />
        {loading && <div>Loading...</div>}
        {error && <div>Error logging in!</div>}
      </React.Fragment>
    </Wrapper>
  );
};

export default SignIn;
