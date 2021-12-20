import React from 'react';
// import { Link } from 'react-router-dom';
import './Home.css';

const clickProfile = (props) => {
  const url = '/profile';
  props.changeState({ link: url });
};

function Home(props) {
  const { changeState, state } = props;

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
          <button type="submit" className="photos">Photos</button>
        </div>

        <div className="main-area">

          <div className="post-create-area">
            User can create post here
            <div className="text-area" />
            <div className="post-button" />
          </div>

          <div className="post-area">
            Posts can be viewed here
            <div className="box-1">
              <div className="poster-picture" />
              <div className="update-text" />
              <div className="reply-button" />
            </div>

            <div className="box-2">
              <div className="poster-picture" />
              <div className="update-text" />
              <div className="reply-button" />
            </div>
          </div>
        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
        </div>

      </div>
    </div>
  );
}

export default Home;
export { clickProfile };
