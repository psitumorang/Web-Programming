import './ProfilePage.css';
import React, { useEffect, useState } from 'react';
import { getUserPosts, getProfile, sendReply } from './ProfileModule';
// import { getProfile, getUserPosts } from './ProfileModule';
// import './ProfileModule.js';
// import '../DatabaseModule';
// import { ReactHtmlParser } from 'react-html-parser';
// const database = require('../DatabaseModule');
// const profileModules = require('./ProfileModule');

function ProfilePage(props) {
  // dummy profile to help implement component frontend with right schema
  // define states
  const dummyProfile = {
    biography: '',
    first_name: 'Stacy',
    last_name: 'Shapiro',
    user_id: 1,
  };

  const [userProfile, setUserProfile] = useState(dummyProfile);
  const [userPosts, setUserPosts] = useState([]);

  const updateUserPosts = async () => {
    // extract id from props
    console.log('props is: ', props);
    const { userId } = props.state;

    const dummyId = 9;
    console.log(userId);

    // call backend for content linked to userId
    const postsToSet = await getUserPosts(dummyId);
    const profileToSet = await getProfile(dummyId);

    // update state
    setUserPosts(postsToSet);
    // don't know why I need to index it at all let alone double, gets the right data structure
    setUserProfile(profileToSet[0][0]);
    console.log('just reset the userProfile with the actual db pulled value, with: ', profileToSet[0][0]);
  };

  useEffect(() => {
    updateUserPosts();
  }, []);

  useEffect(async () => {
    console.log('state updated, userPosts is now: ', userPosts);
  }, [userPosts]);

  return (
    <div className="App">
      <div id="cover_space">
        <img id="user_profile_pic" src="Stacy meditating.jpg" alt="" />
        <div id="main_title">
          {`${userProfile.first_name} ${userProfile.last_name}`}
          &apos;s FaceTok Page
        </div>
      </div>
      <div id="nav_button_container">
        <div className="nav_button">Friends</div>
        <div className="nav_button">Photos</div>
        <div className="nav_button">Groups</div>
        <div className="nav_button">Update bio</div>
        <div className="nav_button">Settings</div>
      </div>
      <div id="main_content_container">
        <div id="key_bio_info">
          <b>
            {userProfile.first_name}
            &apos;s bio
          </b>
          <p />
          {userProfile.biography}
        </div>
        <div id="post_container">
          {userPosts.map((post) => (
            <div className="wall_post">
              <img className="wall_post_pic" src={post.photourl} alt="" />
              <p />
              <div className="post_caption">
                {post.caption}
              </div>
              <div className="post_content_container">
                { post.comments.map((comment) => (
                  <div>
                    <p />
                    <b className="post_content_name">{comment.name}</b>
                    <div>
                      {comment.comment_txt}
                    </div>
                  </div>
                )) }
                <p />
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button" onClick={() => sendReply(post.post_id, userProfile.user_id, 'testcommentinsertion!', updateUserPosts)} onKeyDown={() => sendReply(post.post_id, userProfile.user_id, 'testcommentinsertion!', updateUserPosts)} role="link" tabIndex={0}>Reply!</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
