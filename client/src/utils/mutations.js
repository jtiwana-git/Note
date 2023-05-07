import { gql } from '@apollo/client';

export const SIGNUP_USER = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($username: String!, $email: String!, $password: String!) {
    signIn(username: $username, email: $email, password: $password) {
      token
      user {
        username
        email
      }
    }
  }
`;

export const NEW_NOTE = gql`
  mutation NewNote($content: String!) {
    newNote(content: $content) {
      id
      content
      createdAt
      favoriteCount
      favoritedBy {
        id
        username
      }
      author {
        id
        username
      }
    }
  }
`;
