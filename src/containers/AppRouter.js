import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';
import Search from './Search';
import Mylist from './Mylist';
import Navbar from './Navbar';

const AppRouter = () => (
  <BrowserRouter>
    <>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/mylist" component={Mylist} />
        <Route component={NotFound} />
      </Switch>
    </>
  </BrowserRouter>
);

export default AppRouter;
