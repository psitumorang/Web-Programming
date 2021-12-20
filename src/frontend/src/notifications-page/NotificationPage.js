import { useState, useEffect, React } from 'react';
import './NotificationPage.css';

const lib = require('./NotificationModule');

function NotificationPage(props) {
  const { changeState, state } = props;

  const [notifs, setNotifs] = useState([]);

  const updateNotifs = async () => {
    const n = await lib.getNotifications(state.userId);

    setNotifs(n);
  };

  // eslint-disable-next-line
  console.log(notifs);

  useEffect(() => { updateNotifs(); }, []);

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
          {notifs.map((n) => (
            <div className="notification" key={n.id}>
              <div className="title">
                {
                  `Notification! ${new Date(Date.parse(n.date)).getMonth()}-${new Date(Date.parse(n.date)).getDate()}-${new Date(Date.parse(n.date)).getFullYear()} at ${new Date(Date.parse(n.date)).getHours()}:${new Date(Date.parse(n.date)).getMinutes()}`
                }
              </div>
              <div className="info">
                <div className={`mark-as-read-dot ${n.is_read === 1 ? 'read' : 'unread'}`} />
                <div className="message">{n.msg}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="side-navbar" id="forMessages">
          <button type="submit" className="messages" onClick={() => changeState({ link: '/messages' })}>Messages</button>
          <button type="submit" className="logout" onClick={() => changeState({ link: '/' })}>Log out</button>
        </div>

      </div>
    </div>
  );
}

export default NotificationPage;
