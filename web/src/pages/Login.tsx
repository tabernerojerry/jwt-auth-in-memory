import React, { useState } from 'react';
import { useLoginMutation, MeDocument, MeQuery } from '../generated/graphql';
import { RouteComponentProps } from 'react-router';
import { setAccessToken } from '../access-token';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  return (
    <form onSubmit={async e => {
      e.preventDefault();

      const response = await login({
        variables: {
          email,
          password
        },
        /**
         * Update the apollo cache
         * and call the MeQuery
         */
        update: (store, { data }) => {
          if (!data) {
            return null;
          }

          store.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: 'Query',
              me: data.login.user
            }
          });
        }
      });

      if (response && response.data) {
        setAccessToken(response.data.login.accessToken);
      }

      console.log(response);

      history.push('/');
    }}>
      <div>
        <input type="email" value={email} placeholder="Email" onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <input type="password" value={password} placeholder="Password" onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">Login</button>
    </form>
  )
};
