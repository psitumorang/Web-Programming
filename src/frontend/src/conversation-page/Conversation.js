import { useState, useEffect, React } from 'react';
import './Conversation.css';

const lib = require('./ConversationModule');

function Conversation(props) {
  const { changeState, state } = props;
  // eslint-disable-next-line
  const [message, setMessage] = useState([]);

  const updateState = async () => {
    const msgs = await lib.getMessages(state.viewingConvo.id);

    setMessage(msgs);
    lib.parseMessages(msgs, state.userId);
    document.getElementById('view-msgs').scrollTop = document.getElementById('view-msgs').scrollHeight;
  };

  useEffect(() => { updateState(); }, []);

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
          <div id="view-msgs">
            You do not have any messages! Send a message.
          </div>
          <div id="send-msg">
            <textarea id="sendMsgTxt" placeholder="Send a message!" />
            <button type="submit" id="sendMsgButton" onClick={() => lib.sendMessage(state, updateState)}>Send</button>
          </div>
        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
        </div>

      </div>
    </div>
  );
}

export default Conversation;
