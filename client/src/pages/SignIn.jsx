import React from 'react';
import { useEffect } from 'react';

const SignIn = (props) => {
  useEffect(() => {
    document.title = 'Sign In';
  });

  return (
    <div>
      <p>Sign IN</p>
    </div>
  );
};

export default SignIn;
