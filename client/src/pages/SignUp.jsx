import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Button from '../component/Button';
import { useMutation } from '@apollo/client';
import { SIGNUP_USER } from '../utils/mutations';

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
  const [values, setValues] = useState();

  const [signUp, { loading, error }] = useMutation(SIGNUP_USER);

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    document.title = 'Sign Up - NOTEDLY';
  });

  const onSubmitData = async (event) => {
    event.preventDefault();
    console.log(values);

    try {
      const { data } = await signUp({
        variables: { ...values },
      });
      Auth.login(data.signUp.token);
    } catch (e) {
      console.error(e);
    }
  };

  //  const onSubmitData = (event) => {
  //   event.preventDefault();
  //   console.log(values);

  //   try {
  //     const { data } = await SignUp({
  //       variables: { ...values },
  //     });
  //     Auth.login(data.signUp.token);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <Wrapper>
      <h3>Sign Up</h3>
      <Form onSubmit={onSubmitData}>
        <label htmlFor="username">Username</label>
        <input
          required
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          onChange={onChange}
        />
        <label htmlFor="email">Email</label>
        <input
          required
          type="text"
          id="email"
          name="email"
          placeholder="Email"
          onChange={onChange}
        />
        <label htmlFor="email">Password</label>
        <input
          required
          type="text"
          id="password"
          name="password"
          placeholder="Password"
          onChange={onChange}
        />
        <Button type="submit">Sign Up</Button>
      </Form>
    </Wrapper>
  );
};
export default SignUp;
