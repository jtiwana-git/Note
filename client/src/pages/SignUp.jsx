import React, { useEffect } from 'react';
import styled from 'styled-components';

import Button from '../component/Button';

const Wrapper = styled.div`
  border: 1px solid #f5f4f0;
  max-width: 500px;
  padding: 1em;
  margin: 0 auto;
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

const SignUp = (props) => {
  useEffect(() => {
    document.title = 'Sign Up - Notedly';
  });

  return (
    <Wrapper>
      <Form>
        <label htmlFor="username">Username</label>
        <input
          required
          type="text"
          id="username"
          name="username"
          placeholder="Username"
        />
        <label htmlFor="email">Email</label>
        <input
          required
          type="text"
          id="email"
          name="email"
          placeholder="Email"
        />
        <label htmlFor="email">Password</label>
        <input
          required
          type="text"
          id="password"
          name="password"
          placeholder="Password"
        />
        <Button type="submit">Sign Up</Button>
      </Form>
    </Wrapper>
  );
};
export default SignUp;
