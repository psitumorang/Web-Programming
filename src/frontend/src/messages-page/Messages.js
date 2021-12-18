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
        <div className="username">{`Hi, ${state.username}!`}</div>
      </div>

      <div className="top-navbar">
        <div className="home-link" onClick={() => changeState({ link: '/main' })} onKeyDown={() => changeState({ link: '/main' })} role="link" tabIndex={0}>Home</div>
        <div className="profile-link" onClick={() => changeState({ link: '/profile' })} onKeyDown={() => changeState({ link: '/profile' })} role="link" tabIndex={0}>Profile</div>
      </div>

      <div className="main-container">

        <div className="side-navbar">
          <button type="submit" className="notifications" onClick={() => changeState({ link: '/notifications' })}>Notifications</button>
          <button type="submit" className="events">Events</button>
          <button type="submit" className="groups" onClick={() => changeState({ link: '/groups' })}>Groups</button>
          <button type="submit" className="invitations" onClick={() => changeState({ link: '/invitations' })}>Group Invitations and Requests </button>
          <button type="submit" className="photos">Photos</button>
        </div>

        <div className="main-area">
          <div className="info-area">
            Start a new conversation!
            <br />
            {window.location.href.split('/').pop() === 'error' ? 'ERROR sending message: cannot message self.' : null}
            {window.location.href.split('/').pop() === 'group' ? 'ERROR sending message: cannot message user not in a group with you.' : null}
            {window.location.href.split('/').pop() === 'user' ? 'ERROR sending message: cannot message to user that does not exist.' : null}
            <div id="form">
              <input type="text" id="otherName" placeholder="your friend's username" />
              <textarea id="firstMsg" placeholder="type in a message!" />
              <button type="submit" id="sendFirstMsg" onClick={() => lib.startConvo(state, updateMessages, changeState)}>Start conversation!</button>
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
