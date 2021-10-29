import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './login-page/LoginPage';
import home from './home-page/home';

function MainPage() {
  const [state, updateState] = useState('/');
    
  const changeLink = (link) => {
      window.history.pushState(null, '', link);
      updateState(link);
  };
    
  console.log(state);
  return (
    <Router>
      {window.location.href.split('/').pop() === '' || window.location.href.split('/').pop() === 'registration' || window.location.href.split('/').pop() === 'invalid' ? <LoginPage changeLink={changeLink}/> : <home />}
    </Router>
  );
}

export default MainPage;
