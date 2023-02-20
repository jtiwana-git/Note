import { Link, withRouter } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

import logo from '../img/logo.svg';

import { IS_LOGGED_IN } from '../utils/queries';
import { useQuery } from '@apollo/client';
import ButtonAsLink from './ButtonAsLink';
import Auth from '../utils/auth';

const HeaderBar = styled.header`
  width: 100%;
  padding: 0.5em 1em;
  display: flex;
  position: fixed;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  z-index: 1;
`;

const LogoText = styled.h1`
  margin: 0;
  padding: 0;
  display: inline;
`;

const UserState = styled.div`
  margin-auto: auto;
`;

const Header = () => {
  const { data } = useQuery(IS_LOGGED_IN);
  return (
    <HeaderBar>
      <img src={logo} alt="Notedly Logo" height="40" />
      <LogoText>Notedly</LogoText>
      <UserState>
        {Auth.loggedIn() ? (
          <ButtonAsLink onClick={Auth.logout}>Log Out</ButtonAsLink>
        ) : (
          <p>
            <Link to="/login">Log In </Link>
            or <Link to="/signup">Sign Up</Link>
          </p>
        )}
      </UserState>
    </HeaderBar>
  );
};

export default Header;
