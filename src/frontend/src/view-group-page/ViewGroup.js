import { useState, useEffect, React } from 'react';
import {
  getGroup,
  getAdmins,
  revokeAdmin,
  addAdmin,
  inviteNonAdmin,
  createPost,
  getPosts,
  parsePosts,
  getReplies,
  parseReplies,
  parseOnclicks,
  leaveGroup,
} from './ViewGroupModule';
import './ViewGroup.css';

// eslint-disable-next-line

function ViewGroup(props) {
  // eslint-disable-next-line
  const { changeState, state } = props;
  // eslint-disable-next-line
  const [selected, updateSelected] = useState('text');

  const [groupAndAdmins, setGroupAndAdmins] = useState({ group: {}, admins: [] });
  const [message, setMessage] = useState(' ');
  const [editComment, setEditComment] = useState(-1);

  const updateState = async () => {
    const group = await getGroup(state.viewingGroup);
    const admins = await getAdmins(state.viewingGroup);

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
    const posts = await getPosts(changeState, state.viewingGroup);

    setAllPosts(posts.result);
    parsePosts(posts.result[0]);
  };

  const createPostObject = async () => {
    // eslint-disable-next-line
    const res = await createPost(changeState,
      state.viewingGroup,
      state.userId,
      document.getElementById('postCaption').value,
      selected,
      updateState,
      state.username);

    const posts = await getPosts(changeState, state.viewingGroup);
    // eslint-disable-next-line no-console
    // console.log(`posts: ${JSON.stringify(posts.result[0])}`);

    setAllPosts(posts.result[0]);

    // eslint-disable-next-line no-console
    console.log(`all posts: ${JSON.stringify(allPosts)}`);
    changeState({ link: '/viewgroup' });
  };

  // eslint-disable-next-line no-unused-vars
  const [allReplies, setAllReplies] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const updateReplies = async () => {
    const posts = await getPosts(changeState, state.viewingGroup);
    const replies = await getReplies(changeState, state.viewingGroup);

    setAllReplies(replies.result);
    console.log(editComment);
    if (replies.result) {
      parseReplies(posts.result[0], replies.result[0], editComment, setEditComment);
      parseOnclicks(state, changeState, posts.result[0], replies.result[0], setEditComment);
    }
  };

  const conditionalRender = () => {
    if (selected === 'text') {
      console.log('text');
      return (
        <div id="form">
          <textarea id="postCaption" placeholder="Post message to group" />
        </div>
      );
    }
    if (selected === 'audio') {
      console.log('audio');
      return (
        <div id="form">
          <textarea id="postCaption" placeholder="Write a caption" />
          <input type="file" id="postContent" multiple accept="audio/*" />
        </div>
      );
    }
    if (selected === 'video') {
      console.log('video');
      return (
        <div id="form">
          <textarea id="postCaption" placeholder="Write a caption" />
          <input type="file" id="postContent" multiple accept="video/*" />
        </div>
      );
    }
    if (selected === 'image') {
      console.log('image');
      return (
        <div id="form">
          <textarea id="postCaption" placeholder="Write a caption" />
          <input type="file" id="postContent" multiple accept="image/*" />
        </div>
      );
    }
    return null;
  };

  const updates = async () => {
    await updateState();
    await updatePosts();
    await updateReplies();
  };

  useEffect(() => { updates(); }, [state, editComment]);

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
          <div className="info-area" id="info-area">
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
            <div className="join-group" id="join-group-id">
              <input type="button" value="Leave group" id="submit" onClick={() => leaveGroup(state.userId, groupAndAdmins.group.group_id, updateMessage)} />
            </div>
          </div>
          {message}

          <div className="view-area" id="groups-area">
            <div id="revoke">
              { state.link.includes('/viewgroup/error') ? (<p>Error: cannot revoke creator of group</p>) : (null)}
              <label htmlFor="revokeAdmin">
                {'Revoke Admin: '}
                <input id="revokeAdmin" type="text" placeholder="Enter username" />
              </label>
              <input type="button" value="Submit" id="submit" onClick={() => revokeAdmin(state, changeState, groupAndAdmins, setGroupAndAdmins)} />
            </div>
            <div id="add">
              { state.link.includes('/viewgroup/admin') ? (<p>Error: potential admin is not a group member</p>) : (null)}
              <label htmlFor="addAdmin">
                {'Add Admin: '}
                <input id="addAdmin" type="text" placeholder="Enter username" />
              </label>
              <input type="button" value="Submit" id="submit" onClick={() => addAdmin(groupAndAdmins, setGroupAndAdmins, changeState)} />
            </div>
            <div id="add-non-admin">
              <label htmlFor="addNonAdmin">
                Invite a non-Admin member:
                <input id="addNonAdmin" type="text" placeholder="Enter username" />
              </label>
              <input type="button" value="Submit" id="submit" onClick={() => inviteNonAdmin(groupAndAdmins, state, setGroupAndAdmins)} />
            </div>
          </div>

          <div className="posts-area">
            <div className="text-input">
              Create Post:
              { state.link.includes('/viewgroup/post/error') ? (<p>Error: post is too large</p>) : (null)}
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
              {conditionalRender()}
              <button className="post-button" type="submit" onClick={() => createPostObject()}> Post Message </button>
            </div>
            <div className="posts" id="posts-area" />
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

export default ViewGroup;
