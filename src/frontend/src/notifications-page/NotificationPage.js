import React from 'react';
import './Notification.css';

const module = require('./NotificationModule');

const clickProfile = (props) => {
  const url = '/notifications';
  props.changeState({ link: url });
};

function Home(props) {
  const { changeState, state } = props;
    
  const notifications = module.getNotifications(state.userId);

  return (
    <div className="container">

      <div className="header">
        <div className="social-media-title">Social Media</div>
        <div className="profile-picture">
          <div className="img" />
        </div>
        <div className="username">Hi, username!</div>
      </div>

      <div className="top-navbar">
        <div className="home-link">Home</div>
        <div className="profile-link" onClick={() => clickProfile(props)} onKeyDown={() => clickProfile(props)} role="link" tabIndex={0}>Profile</div>
      </div>

      <div className="main-container">

        <div className="side-navbar">
          <button type="submit" className="Notifications" onClick={() => changeState({ link: '/notifications' })}>Notifications</button>
          <button type="submit" className="events">Events</button>
          <button type="submit" className="groups" onClick={() => changeState({ link: '/groups' })}>Groups</button>
          <button type="submit" className="videos">Videos</button>
          <button type="submit" className="photos">Photos</button>
        </div>

        <div className="main-area">
            // will be a dynamic list of notifications
            <div className="notification">
              <div id="mark-as-read-dot"></div>
              <div id="title"></div>
              <div id="message"></div>
            </div>
        </div>

        <div className="message-updates">
          Message updates
        </div>

      </div>
    </div>
  );
}

export default Home;
export { clickProfile };
