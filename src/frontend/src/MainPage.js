import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './login-page/LoginPage';
import Home from './home-page/Home';
import ProfilePage from './profile-page/ProfilePage';

function MainPage() {
  const [state, updateState] = useState('/');

  const changeLink = (link) => {
    window.history.pushState(null, '', link);
    updateState(link);
  };

  return (
    <Router>
      <article>
        <Route exact path="/" render={() => (<LoginPage changeLink={changeLink} />)} />
        <Route exact path="/registration" render={() => (<LoginPage changeLink={changeLink} />)} />
        <Route exact path="/invalid" render={() => (<LoginPage changeLink={changeLink} />)} />
        <Route exact path="/profile" render={() => (<ProfilePage changeLink={changeLink} />)} />
        <Route exact path="/home" render={() => (<Home changeLink={changeLink} />)} />
        <Route exact path="/main" render={() => (<Home changeLink={changeLink} />)} />
      </article>
      {state}
    </Router>
  );
}

export default MainPage;
