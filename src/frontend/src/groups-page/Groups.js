import { useEffect, useState, React } from 'react';
import './Groups.css';

const lib = require('./GroupsModule');

function Groups(props) {
  const { changeState } = props;
  // eslint-disable-next-line no-unused-vars
  const [allGroups, setAllGroups] = useState([]);

  const updateGroups = async () => {
    const groups = await lib.getGroups(changeState);
    const admins = await lib.getAdmins();
    // eslint-disable-next-line
    console.log(groups.result);
    setAllGroups(groups.result);
    lib.parseGroups(changeState, groups.result[0], admins);
  };

  const createGroup = async () => {
    // eslint-disable-next-line
    const res = await lib.createGroup(changeState,
      document.getElementById('groupname').value,
      1,
      document.getElementById('groupdescription').value,
      document.getElementById('ispublic').value,
      document.getElementById('topic1').value,
      document.getElementById('topic2').value,
      document.getElementById('topic3').value);

    const groups = await lib.getGroups(changeState);
    const admins = await lib.getAdmins();
    setAllGroups(groups.result);
    lib.parseGroups(changeState, groups.result[0], admins);
  };

  useEffect(() => { updateGroups(); }, []);

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
          <div className="post-area">
            <div className="left-group-input">
              <div className="textDiv" id="groupnameDiv">
                <label htmlFor="groupname">
                  Group Name:
                  <input className="text" id="groupname" type="text" placeholder="group name" />
                </label>
              </div>
              <div className="textDiv" id="groupdescriptionDiv">
                <label htmlFor="groupdescription">
                  Group Description:
                  <input className="text" id="groupdescription" type="text" placeholder="group description" />
                </label>
              </div>
              <div className="textDiv" id="ispublicDiv">
                <label htmlFor="ispublic">
                  Is Public?
                  <input className="text" id="ispublic" type="text" placeholder="1 or 0" />
                </label>
              </div>
            </div>
            <div className="right-group-input">
              <div className="textDiv" id="topic1Div">
                <label htmlFor="topic1">
                  Topic 1:
                  <input className="text" id="topic1" type="text" placeholder="group topic 1" />
                </label>
              </div>
              <div className="textDiv" id="topic2Div">
                <label htmlFor="groupdescription">
                  Topic 2:
                  <input className="text" id="topic2" type="text" placeholder="group topic 2" />
                </label>
              </div>
              <div className="textDiv" id="topic-3-Div">
                <label htmlFor="ispublic">
                  Topic 3:
                  <input className="text" id="topic3" type="text" placeholder="group topic 3" />
                </label>
              </div>
            </div>

            <button type="submit" className="createGroup" onClick={() => { createGroup(); updateGroups(); }}> Create A Group </button>
          </div>

          <div className="groups-area" id="groups-area">
            There are no groups yet!
          </div>
        </div>

        <div className="message-updates">
          Message updates
        </div>

      </div>
    </div>
  );
}

export default Groups;
