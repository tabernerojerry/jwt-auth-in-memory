import React, { useState, useEffect } from 'react';
import { Routes } from './Routes';
import { setAccessToken } from './access-token';

interface Props {}

export const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);

  /**
   * When the user refresh the page
   * we call the refresh token api endpoint
   * to issue as a new access token
   */
  useEffect(() => {
    fetch('http://localhost:5000/refresh-token', {
      method: 'POST',
      credentials: 'include'
    }).then(async data => {
      const { accessToken } = await data.json();
      setAccessToken(accessToken);
      setLoading(false);
    })
  }, []);

  if (loading) {
    return <div>loading...</div>
  }

  return (<Routes />);
};
