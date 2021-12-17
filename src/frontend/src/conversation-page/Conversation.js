// eslint-disable-next-line
import { useState, useEffect, React } from 'react';
import './Conversation.css';

// eslint-disable-next-line
const lib = require('./ConversationModule');

function Conversation(props) {
  // eslint-disable-next-line
  const { changeState, state } = props;

  //  useEffect(() => { updates(); }, [state]);

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
        <div className="profile-link">Profile</div>
      </div>

      <div className="main-container">

        <div className="side-navbar">
          <button type="submit" className="notifications" onClick={() => changeState({ link: '/notifications' })}>Notifications</button>
          <button type="submit" className="events">Events</button>
          <button type="submit" className="groups" onClick={() => changeState({ link: '/groups' })}>Groups</button>
          <button type="submit" className="videos">Videos</button>
          <button type="submit" className="photos">Photos</button>
        </div>

        <div className="main-area"> will be list of messages? </div>
      </div>

      <div className="side-navbar" id="forMessages">
        <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
      </div>
    </div>
  );
}

export default Conversation;
