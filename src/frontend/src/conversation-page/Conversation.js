import { useState, useEffect, React } from 'react';
import { getMessages, parseMessages, sendMessage } from './ConversationModule';
import './Conversation.css';

function Conversation(props) {
  const { changeState, state } = props;
  // eslint-disable-next-line
  const [selected, updateSelected] = useState('text');

  // eslint-disable-next-line
  const [message, setMessage] = useState([]);

  const updateState = async () => {
    const msgs = await getMessages(state.viewingConvo.id, state.userId);

    setMessage(msgs);
    parseMessages(msgs, state.userId);
    document.getElementById('view-msgs').scrollTop = document.getElementById('view-msgs').scrollHeight;
  };

  const conditionalRender = () => {
    if (selected === 'text') {
      console.log('text');
      return (
        <textarea id="firstMsg" placeholder="type in a message!" />
      );
    }
    if (selected === 'audio') {
      console.log('audio');
      return (
        <input type="file" id="firstMsg" multiple accept="audio/*" />
      );
    }
    if (selected === 'video') {
      console.log('video');
      return (
        <input type="file" id="firstMsg" multiple accept="video/*" />
      );
    }
    if (selected === 'image') {
      console.log('image');
      return (
        <input type="file" id="firstMsg" multiple accept="image/*" />
      );
    }
    return null;
  };

  useEffect(() => { updateState(); }, []);

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
          <div id="view-msgs">
            You do not have any messages! Send a message.
          </div>
          <div id="send-msg">
            {window.location.href.split('/').pop() === 'img' ? 'ERROR sending message: image file too large' : null}
            {window.location.href.split('/').pop() === 'av' ? 'ERROR sending message: audio/video file size too large' : null}
            <div id="options">
              <label htmlFor="textInput" className="list">
                <input type="radio" id="textInput" name="msgType" onClick={() => updateSelected('text')} />
                Text message
              </label>
              <label htmlFor="audioInput" className="list">
                <input type="radio" id="audioInput" name="msgType" onClick={() => updateSelected('audio')} />
                Audio message
              </label>
              <label htmlFor="videoInput" className="list">
                <input type="radio" id="videoInput" name="msgType" onClick={() => updateSelected('video')} />
                Video message
              </label>
              <label htmlFor="imageInput" className="list">
                <input type="radio" id="imageInput" name="msgType" onClick={() => updateSelected('image')} />
                Image message
              </label>
            </div>
            { conditionalRender() }
            <button type="submit" id="sendMsgButton" onClick={() => sendMessage(updateState, selected, state, changeState)}>Send</button>
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
