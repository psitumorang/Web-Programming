import { useEffect, useState, React } from 'react';
import './Groups.css';

const lib = require('./GroupsModule');

function Groups(props) {
  const { state, changeState } = props;
  const [message, setMessage] = useState(' ');
  // eslint-disable-next-line no-unused-vars
  const [allGroups, setAllGroups] = useState([]);
  const [nonMemberGroups, setNonMemberGroups] = useState([]);
  const [suggestedGroup, setSuggestedGroup] = useState([]);

  const updateGroups = async () => {
    const groups = await lib.getGroups(changeState);
    const admins = await lib.getAdmins();
    // eslint-disable-next-line
    // const propsState = props.state;
    const groupMemberships = await lib.getGroupMemberships(state.userId);

    setAllGroups(groups.result);
    lib.parseGroups(changeState, groups.result[0], admins, groupMemberships);
    const groups2 = groups.result[0];
    const nonMemberGroupsResolved = await lib.nonMemberPublicGroups(groupMemberships, groups2);
    let newSuggestedGroup = await lib.suggestGroup(groupMemberships, groups2);

    setNonMemberGroups(nonMemberGroupsResolved);
    if (typeof newSuggestedGroup[0] === 'undefined') {
      newSuggestedGroup = [];
    }
    setSuggestedGroup(newSuggestedGroup);
  };

  const updateMessage = (newMessage) => {
    setMessage(newMessage);
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
      document.getElementById('topic3').value,
    );

    const groups = await lib.getGroups(changeState);
    const admins = await lib.getAdmins();
    setAllGroups(groups.result);
    lib.parseGroups(changeState, groups.result[0], admins);
  };

  useEffect(() => {
    updateGroups();
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
          <button type="submit" className="photos" onClick={() => changeState({ link: '/flaggedposts' })}>Flagged posts</button>
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

          <div className="heading-for-groups" id="heading-for-groups">
            Groups in which you&apos;re a member:
          </div>

          <div className="groups-area" id="groups-area">
            There are no groups yet!
          </div>

          <div className="groups-non-member-message" id="groups-non-member-message">
            {message}
          </div>

          <div className="heading-for-groups" id="heading-for-groups-non-member">
            Other public groups you can request to join:
          </div>

          <div className="groups-area" id="groups-area-non-member">
            <p />
            {nonMemberGroups.map((group) => (
              <div className="non-member-group group-container" key={group.group_name}>
                <div>
                  {`Group name: ${group.group_name}`}
                </div>
                <div>
                  {`Group description: ${group.group_description}`}
                </div>
                <div>
                  <input type="button" value="Request to join group" id="submit" onClick={() => lib.requestJoinGroup(state.userId, group.group_id, updateMessage)} />
                </div>
                <p />
              </div>
            ))}
          </div>

          <div className="heading-for-groups" id="heading-for-suggested-group">
            Here&apos;s a heavily personalised (not randomised at all) group recommendation:
          </div>

          <div className="groups-area" id="groups-area-suggestions">
            {suggestedGroup.map((group) => (
              <div className="non-member-group group-container" key={`suggest-${group.group_name}`}>
                <div>
                  {`Group name: ${group.group_name}`}
                </div>
                <div>
                  {`Group description: ${group.group_description}`}
                </div>
                <div>
                  <input type="button" value="Request to join group" id="submit" onClick={() => lib.requestJoinGroup(state.userId, group.group_id, updateMessage)} />
                </div>
                <p />
              </div>
            ))}
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

export default Groups;
