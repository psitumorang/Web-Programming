import { useState, useEffect, React } from 'react';
import './Messages.css';

const lib = require('./MessagesModule');

function Messages(props) {
  // eslint-disable-next-line
  const [msgs, updateMsgs] = useState([]);
  const { changeState, state } = props;

  const updateMessages = async () => {
    const convos = await lib.getConvos(state.userId);
    console.log(convos.length, convos);
    updateMsgs(convos);
    lib.parseConvos(changeState, convos);
  };

  useEffect(() => { updateMessages(); }, []);

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

        <div className="main-area">
          <div className="info-area">
            Start a new conversation!
            <div id="form">
              <input type="text" id="otherName" placeholder="your friend's username" />
              <textArea id="firstMsg" placeholder="type in a message!" />
              <button type="submit" id="sendFirstMsg" onClick={() => lib.startConvo(state, updateMessages)}>Start conversation!</button>
            </div>
          </div>

          <div className="convo-area" id="view-convos">
            You do not have any messages :(
          </div>
        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
        </div>

      </div>
    </div>
  );
}

export default Messages;
