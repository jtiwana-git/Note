import React, { useState } from 'react';
import styled from 'styled-components';

import Button from './Button';

const Wrapper = styled.div`
  border: 1px solid #f5f4f0;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
`;

const Form = styled.form`
  label,
  input {
    display: block;
    line-height: 2rem;
  }
  input {
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const UserForm = (props) => {
  const [values, setValues] = useState();

  const onChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    props.action({
      variables: { ...values },
    });
    console.log(values);
  };
  return (
    <Wrapper>
      {props.formType === 'signup' ? <h2>Sign up</h2> : <h2>Log in</h2>}
      <Form onSubmit={onSubmit}>
        {props.formType === 'signup' && (
          <React.Fragment>
            <label htmlFor="username">Username</label>
            <input
              required="true"
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              onChange={onChange}
            />
          </React.Fragment>
        )}
        <label htmlFor="username">Username</label>
        <input
          required="true"
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          onChange={onChange}
        />
        <label htmlFor="email">Email</label>
        <input
          required
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          onChange={onChange}
        />
        <label htmlFor="password">Password</label>
        <input
          required
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          onChange={onChange}
        />
        <Button type="submit">Submit!</Button>
      </Form>
    </Wrapper>
  );
};

export default UserForm;
