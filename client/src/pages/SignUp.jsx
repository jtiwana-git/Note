import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Button from '../component/Button';
import { useMutation, useApolloClient } from '@apollo/client';
import { SIGNUP_USER } from '../utils/mutations';

import UserForm from '../component/UserForm';
import Auth from '../utils/auth';

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
// need to add auth file and refactor code below

const SignUp = (props) => {
  useEffect(() => {
    document.title = 'Sign Up - NOTEDLY';
  });
  const [values, setValues] = useState();

  const client = useApolloClient();
  const [signUp, { loading, error }] = useMutation(SIGNUP_USER, {
    onCompleted: (data) => {
      Auth.login(data.signUp.token);
      client.writeQuery({ data: { isLoggedIn: true } });
    },
  });

  // check if this code is in use

  return (
    <Wrapper>
      <React.Fragment>
        <UserForm action={signUp} formType="signup" />
        {loading && <p>Loading...</p>}
        {error && <p>Error in creating account!</p>}
      </React.Fragment>
    </Wrapper>
  );
};
export default SignUp;
