import { useState, useEffect, React } from 'react';
import './AnalyticsPage.css';

const lib = require('./AnalyticsModule');

const updateFacts = async (setGroupFacts, setPostFacts) => {
  const newGroupFacts = await lib.getGroupAnalyticsFacts();
  setGroupFacts(newGroupFacts);

  const newPostFacts = await lib.getPostAnalyticsFacts();
  setPostFacts(newPostFacts);
};

function AnalyticsPage(props) {
  const { changeState, state } = props;
  const [groupFacts, setGroupFacts] = useState([]);
  const [postFacts, setPostFacts] = useState([]);

  useEffect(() => {
    updateFacts(setGroupFacts, setPostFacts);
  }, []);

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
          <div>
            Super advanced group analytics:
          </div>
          {groupFacts.map((fact) => (
            <div>
              {`${fact[0]}: ${fact[1]}`}
            </div>
          ))}
          <p />
          <div>
            Equally advanced post analytics:
          </div>
          {postFacts.map((fact) => (
            <div>
              {`${fact[0]}: ${fact[1]}`}
            </div>
          ))}
        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsPage;
