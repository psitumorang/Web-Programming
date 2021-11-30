import React, { useState } from 'react';
/** import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom'; */
import LoginPage from './login-page/LoginPage';
import Home from './home-page/Home';
import ProfilePage from './profile-page/ProfilePage';
import UpdatePassword from './profile-page/UpdatePassword';

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
      return (<ProfilePage changeState={changeState} state={state} />);
    }
    if (url.includes('/home') || url.includes('/main')) {
      return (<Home changeState={changeState} state={state} />);
    }
    if (url.includes('/changepassword')) {
      return (<UpdatePassword changeState={changeState} state={state} userId={state.userId} />);
    }
    const last = url.split('/').pop();
    if (url.includes('/registration') || last === '' || url.includes('/error')) {
      return (<LoginPage changeState={changeState} state={state} />);
    }

    // TODO: change this to something meaningful
    return state;
  };

  return (
    conditionallyRender(window.location.href)

  /**  <Router>
      <Switch>
        <Route exact path="/">
          <LoginPage changeState={changeState} />
        </Route>
        <Route path="/home">
          <Home changeState={changeState} />
        </Route>
        <Route path="/profile">
          <ProfilePage changeState={changeState} stateVar={state} />
        </Route>
      </Switch>
    </Router>

  */
  );
}

export default MainPage;
// export default withRouter(MainPage);

/** to change back to router model:
 *
 * withRouter around mainpage
 * actual Router and Switch elements on main page
 * conditionally render (in return AND the definition) on main page,
 *  commented out in router model, but uncommented
 * import statements on mainpage - added a bunch from react router dom
 * router model had <BrowserRouter> around main page (inc closing bracket) in index.js
 *  and importing the relevant module
 * Adding Link element to the home page and the relevant module
 */
