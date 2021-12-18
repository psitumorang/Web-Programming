import { useState, useEffect, React } from 'react';
import './ViewGroup.css';

// eslint-disable-next-line
const lib = require('./ViewGroupModule');

function ViewGroup(props) {
  // eslint-disable-next-line
  const { changeState, state } = props;

  const [groupAndAdmins, setGroupAndAdmins] = useState({ group: {}, admins: [] });
  const [message, setMessage] = useState(' ');

  const updateState = async () => {
    const group = await lib.getGroup(state.viewingGroup);
    const admins = await lib.getAdmins(state.viewingGroup);

    setGroupAndAdmins(() => ({
      group,
      admins,
    }));
  };

  const updateMessage = (newMessage) => {
    setMessage(newMessage);
  };

  const processAdmins = (admins) => {
    let adminLst = '';
    admins.forEach((admin) => {
      const toShow = (admin.is_creator === 1 ? `${admin.user_name} (creator)` : `${admin.user_name}`);

      adminLst += (adminLst === '' ? `${toShow} ` : `, ${toShow}`);
    });
    return adminLst;
  };

  // eslint-disable-next-line no-unused-vars
  const [allPosts, setAllPosts] = useState([]);

  const updatePosts = async () => {
    const posts = await lib.getPosts(changeState, state.viewingGroup);

    setAllPosts(posts.result);
    lib.parsePosts(posts.result[0]);
  };

  const createPost = async () => {
    // eslint-disable-next-line
    const res = await lib.createPost(changeState,
      state.viewingGroup,
      state.userId,
      document.getElementById('post').value);

    const posts = await lib.getPosts(changeState, state.viewingGroup);
    // eslint-disable-next-line no-console
    // console.log(`posts: ${JSON.stringify(posts.result[0])}`);

    setAllPosts(posts.result[0]);

    // eslint-disable-next-line no-console
    console.log(`all posts: ${JSON.stringify(allPosts)}`);
    changeState({ link: '/viewgroup' });

    /*
    lib.parsePosts(posts.result[0]);
    */
  };

  // eslint-disable-next-line no-unused-vars
  const [allReplies, setAllReplies] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const updateReplies = async () => {
    const posts = await lib.getPosts(changeState, state.viewingGroup);
    const replies = await lib.getReplies(changeState, state.viewingGroup);

    setAllReplies(replies.result);

    if (replies.result) {
      lib.parseReplies(posts.result[0], replies.result[0]);
      lib.parseOnclicks(state, changeState, posts.result[0], replies.result[0]);
    }
  };

  const updates = async () => {
    await updateState();
    await updatePosts();
    await updateReplies();
  };

  useEffect(() => { updates(); }, [state]);

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
          <div className="info-area">
            <div className="group-view">
              <div className="group-info">
                <ul>
                  <li id="group-id">
                    {`Group Id: ${groupAndAdmins.group.group_id}`}
                  </li>
                  <li id="group-name">
                    {`Group Name: ${groupAndAdmins.group.group_name}`}
                  </li>
                  <li id="group-description">
                    {`Group Description: ${groupAndAdmins.group.group_description}`}
                  </li>
                  <li id="group-admins">
                    {`Admins: ${processAdmins(groupAndAdmins.admins)}`}
                  </li>
                  <li id="is-public">
                    {(groupAndAdmins.group.is_public === 1 ? 'Public' : 'Private')}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {message}
          <p />
          <div className="join-group" id="join-group-id">
            <input type="button" value="Request to join group" id="submit" onClick={() => lib.requestJoinGroup(state.userId, groupAndAdmins.group.group_id, updateMessage)} />
            <input type="button" value="Leave group" id="submit" onClick={() => lib.leaveGroup(state.userId, groupAndAdmins.group.group_id, updateMessage)} />
          </div>
          <p />

          <div className="view-area" id="groups-area">
            <div id="revoke">
              { state.link.includes('error') ? (<p>Error: cannot revoke creator of group</p>) : (null)}
              <label htmlFor="revokeAdmin">
                {'Revoke Admin: '}
                <input id="revokeAdmin" type="text" placeholder="Enter username" />
              </label>
              <input type="button" value="Submit" id="submit" onClick={() => lib.revokeAdmin(state, changeState, groupAndAdmins)} />
            </div>
            <div id="add">
              <label htmlFor="addAdmin">
                {'Add Admin: '}
                <input id="addAdmin" type="text" placeholder="Enter username" />
              </label>
              <input type="button" value="Submit" id="submit" onClick={() => lib.addAdmin(groupAndAdmins)} />
            </div>
            <div id="add-non-admin">
              <label htmlFor="addNonAdmin">
                Invite a non-Admin member:
                <input id="addNonAdmin" type="text" placeholder="Enter username" />
              </label>
              <input type="button" value="Submit" id="submit" onClick={() => lib.inviteNonAdmin(groupAndAdmins, state)} />
            </div>
          </div>

          <div className="posts-area">
            <div className="text-input">
              Message:
              <input className="post-input" id="post" type="post" placeholder="Post message to group" />
              <button className="post-button" type="submit" onClick={() => createPost()}> Post Message </button>
            </div>
            <div className="posts" id="posts-area" />
          </div>
        </div>

        <div className="message-updates">
          Message updates
        </div>

      </div>
    </div>
  );
}

export default ViewGroup;
