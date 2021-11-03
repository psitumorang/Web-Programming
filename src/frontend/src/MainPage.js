import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './login-page/LoginPage';
import Home from './home-page/Home';

function MainPage() {
  const [state, updateState] = useState('/');

  const changeLink = (link) => {
    window.history.pushState(null, '', link);
    updateState(link);
  };

  return (
    <Router>
      {window.location.href.split('/').pop() === '' || window.location.href.split('/').pop() === 'registration' || window.location.href.split('/').pop() === 'invalid' ? <LoginPage changeLink={changeLink} /> : <Home changeLink={changeLink} />}
      {state}
    </Router>
  );
}

export default MainPage;
