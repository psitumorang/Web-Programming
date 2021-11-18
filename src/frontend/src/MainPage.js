import React, { useState } from 'react';
import LoginPage from './login-page/LoginPage';
import Home from './home-page/Home';
import ProfilePage from './ProfilePage';

function MainPage() {
  const [state, updateState] = useState({ link: '/', userId: -1 });

  const changeState = (input) => {
    if (typeof input.link !== 'undefined') window.history.pushState(null, '', input.link);
    updateState((oldState) => ({
      link: ((typeof input.link !== 'undefined') ? input.link : oldState.link),
      userId: ((typeof input.userId !== 'undefined') ? input.userId : oldState.userId),
    }));
  };

  const conditionallyRender = (url) => {
    if (url.includes('/profile')) {
      return (<ProfilePage changeState={changeState} />);
    }
    if (url.includes('/home') || url.includes('/main')) {
      return (<Home changeState={changeState} />);
    }
    const last = url.split('/').pop();
    if (url.includes('/registration') || last === '' || url.includes('/error')) {
      return (<LoginPage changeState={changeState} />);
    }
    // TODO: change this to something meaningful
    return state;
  };

  return (
    conditionallyRender(window.location.href)
  );
}

export default MainPage;
