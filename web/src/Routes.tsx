import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Bye } from './pages/Bye';
import { Header } from './components/Header';

export const Routes: React.FC = () => {

  return (
    <BrowserRouter>
      <>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/bye" component={Bye} />
        </Switch>
      </>
    </BrowserRouter>
  );
}
