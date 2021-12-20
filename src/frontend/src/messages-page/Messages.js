import { useState, useEffect, React } from 'react';
import { getConvos, parseConvos, startConvo } from './MessagesModule';
import './Messages.css';

function Messages(props) {
  // eslint-disable-next-line
  const [msgs, updateMsgs] = useState([]);
  const [selected, updateSelected] = useState('text');
  const { changeState, state } = props;

  const updateMessages = async () => {
    const convos = await getConvos(state.userId);
    console.log(convos.length, convos);
    updateMsgs(convos);
    parseConvos(changeState, convos);
  };

  useEffect(() => { updateMessages(); }, []);

  const conditionalRender = () => {
    if (selected === 'text') {
      console.log('text');
      return (
        <div id="form">
          <input type="text" id="otherName" placeholder="your friend's username" />
          <textarea id="firstMsg" placeholder="type in a message!" />
          <button type="submit" id="sendFirstMsg" onClick={() => startConvo(selected, state, updateMessages, changeState)}>Start conversation!</button>
        </div>
      );
    }
    if (selected === 'audio') {
      console.log('audio');
      return (
        <div id="form">
          <input type="text" id="otherName" placeholder="your friend's username" />
          <input type="file" id="firstMsg" multiple accept="audio/*" />
          <button type="submit" id="sendFirstMsg" onClick={() => startConvo(selected, state, updateMessages, changeState)}>Start conversation!</button>
        </div>
      );
    }
    if (selected === 'video') {
      console.log('video');
      return (
        <div id="form">
          <input type="text" id="otherName" placeholder="your friend's username" />
          <input type="file" id="firstMsg" multiple accept="video/*" />
          <button type="submit" id="sendFirstMsg" onClick={() => startConvo(selected, state, updateMessages, changeState)}>Start conversation!</button>
        </div>
      );
    }
    if (selected === 'image') {
      console.log('image');
      return (
        <div id="form">
          <input type="text" id="otherName" placeholder="your friend's username" />
          <input type="file" id="firstMsg" multiple accept="image/*" />
          <button type="submit" id="sendFirstMsg" onClick={() => startConvo(selected, state, updateMessages, changeState)}>Start conversation!</button>
        </div>
      );
    }
    return null;
  };

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
          <button type="submit" className="events" onClick={() => changeState({ link: '/analytics' })}>Analytics</button>
          <button type="submit" className="groups" onClick={() => changeState({ link: '/groups' })}>Groups</button>
          <button type="submit" className="invitations" onClick={() => changeState({ link: '/invitations' })}>Group Invitations and Requests </button>
          <button type="submit" className="photos" onClick={() => changeState({ link: '/flaggedposts' })}>Flagged posts</button>
        </div>

        <div className="main-area">
          <div className="info-area">
            Start a new conversation!
            <br />
            {window.location.href.split('/').pop() === 'error' ? 'ERROR sending message: cannot message self.' : null}
            {window.location.href.split('/').pop() === 'group' ? 'ERROR sending message: cannot message user not in a group with you.' : null}
            {window.location.href.split('/').pop() === 'user' ? 'ERROR sending message: cannot message to user that does not exist.' : null}
            {window.location.href.split('/').pop() === 'img' ? 'ERROR sending message: image file too large.' : null}
            {window.location.href.split('/').pop() === 'av' ? 'ERROR sending message: audio/video file too large.' : null}
            <div>
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
            {conditionalRender()}
          </div>

          <div className="convo-area" id="view-convos">
            You do not have any messages :(
          </div>
        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
          <button type="submit" className="logout" onClick={() => changeState({ link: '/' })}>Log out</button>
        </div>

      </div>
    </div>
  );
}

export default Messages;
