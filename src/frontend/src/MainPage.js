import React, { useState } from 'react';
import LoginPage from './login-page/LoginPage';
import Home from './home-page/Home';
import ProfilePage from './ProfilePage';

function MainPage() {
  const [state, updateState] = useState('/');

  const changeLink = (link) => {
    window.history.pushState(null, '', link);
    updateState(link);
  };

  const conditionallyRender = (url) => {
    if (url.includes('/profile')) {
      return (<ProfilePage changeLink={changeLink} />);
    }
    if (url.includes('/home') || url.includes('/main')) {
      return (<Home changeLink={changeLink} />);
    }
    const last = url.split('/').pop();
    if (url.includes('/registration') || last === '' || url.includes('/error')) {
      return (<LoginPage changeLink={changeLink} />);
    }
    // TODO: change this to something meaningful
    return state;
  };

  return (
    conditionallyRender(window.location.href)
  );
}

export default MainPage;
