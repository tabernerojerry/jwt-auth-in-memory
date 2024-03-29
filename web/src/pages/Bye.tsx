import React from 'react'
import { useByeQuery } from '../generated/graphql';

interface Props {}

export const Bye: React.FC<Props> = () => {
  const {data, loading, error} = useByeQuery({ fetchPolicy: 'network-only' });

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.log(error);
    return <div>error</div>
  }

  if (!data) {
    return <div>no data...</div>
  }

  return (
    <div>{ data.bye }</div>
  );
};
