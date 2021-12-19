import React, { useState } from 'react';
/** import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
  other thing blah
} from 'react-router-dom'; */
import LoginPage from './login-page/LoginPage';
import Home from './home-page/Home';
import ProfilePage from './profile-page/ProfilePage';
import Groups from './groups-page/Groups';
import NotificationPage from './notifications-page/NotificationPage';
import UpdatePassword from './profile-page/UpdatePassword';
import ViewGroup from './view-group-page/ViewGroup';
import InvitationPage from './invitations-page/InvitationPage';
import DeactivateAccountPage from './profile-page/deactivate-account-page/DeactivateAccountPage';
import Messages from './messages-page/Messages';
import Conversation from './conversation-page/Conversation';

function MainPage() {
  const [state, updateState] = useState(
    {
      link: '/',
      userId: -1,
      username: '',
      viewingGroup: -1,
      viewingConvo: { id: -1, otherUserId: -1 },
    },
  );

  const changeState = (input) => {
    if (typeof input.link !== 'undefined') window.history.pushState(null, '', input.link);
    updateState((oldState) => ({
      link: ((typeof input.link !== 'undefined') ? input.link : oldState.link),
      userId: ((typeof input.userId !== 'undefined') ? input.userId : oldState.userId),
      username: ((typeof input.username !== 'undefined') ? input.username : oldState.username),
      viewingGroup: ((typeof input.viewingGroup !== 'undefined') ? input.viewingGroup : oldState.viewingGroup),
      viewingConvo: ((typeof input.viewingConvo !== 'undefined') ? input.viewingConvo : oldState.viewingConvo),
    }));
  };

  const conditionallyRender = (url) => {
    if (url.includes('/profile')) {
      return (<ProfilePage changeState={changeState} state={state} />);
    }
    if (url.includes('/home') || url.includes('/main')) {
      return (<Home changeState={changeState} state={state} />);
    }
    if (url.includes('/groups')) {
      return (<Groups changeState={changeState} state={state} />);
    }
    if (url.includes('/notifications')) {
      return (<NotificationPage changeState={changeState} state={state} />);
    }
    if (url.includes('/messages') || url.includes('/messages/error') || url.includes('/messages/group') || url.includes('/messages/user')) {
      return (<Messages changeState={changeState} state={state} />);
    }
    if (url.includes('/conversation')) {
      return (<Conversation changeState={changeState} state={state} />);
    }
    if (url.includes('/changepassword')) {
      return (<UpdatePassword changeState={changeState} state={state} userId={state.userId} />);
    }
    if (url.includes('/viewgroup') || url.includes('/viewgroup/error')) {
      console.log('view group trying to error)');
      return (<ViewGroup changeState={changeState} state={state} />);
    }
    if (url.includes('/invitations')) {
      return (<InvitationPage changeState={changeState} state={state} />);
    }
    if (url.includes('/deactivate-account')) {
      return (<DeactivateAccountPage changeState={changeState} state={state} />);
    }
    const last = url.split('/').pop();
    const first = url.split('/')[3];
    if (url.includes('/registration') || last === '' || url.includes('/registration/error') || first === 'error') {
      return (<LoginPage changeState={changeState} state={state} />);
    }
    // TODO: change this to something meaningful
    // will become a page that's like Oh this is not available!
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
