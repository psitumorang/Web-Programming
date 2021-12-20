import { React, useEffect } from 'react';
import './FlaggedPosts.css';

const lib = require('./FlaggedPostsModule');

function FlaggedPosts(props) {
  const { changeState, state } = props;

  const update = async () => {
    const flagged = await lib.getFlaggedPostsForReview(state);
    lib.parseFlaggedPosts(flagged, changeState);
  };
  useEffect(() => { update(); }, [state]);

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

          <div className="post-flag-area" id="post-create-area">
            No posts have been flagged! You are off the hook :D
          </div>
        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
        </div>

      </div>
    </div>
  );
}

export default FlaggedPosts;
