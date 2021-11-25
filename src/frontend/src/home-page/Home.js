import React from 'react';
// import { Link } from 'react-router-dom';
import './Home.css';

const clickProfile = (props) => {
  const url = '/profile';
  props.changeState({ link: url });
};

function Home(props) {
  const { changeState } = props;

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
          <button type="submit" className="updates" onClick={() => changeState({ link: '/updates' })}>Updates</button>
          <button type="submit" className="events">Events</button>
          <button type="submit" className="groups" onClick={() => changeState({ link: '/groups' })}>Groups</button>
          <button type="submit" className="videos">Videos</button>
          <button type="submit" className="photos">Photos</button>
        </div>

        <div className="main-area">

          <div className="post-area">
            User can input status update here
            <div className="text-area" />
            <div className="post-button" />
          </div>

          <div className="updates-area">
            Status updates will be located here
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

        <div className="live-updates">
          Live updates
        </div>

      </div>
    </div>
  );
}

export default Home;
export { clickProfile };
