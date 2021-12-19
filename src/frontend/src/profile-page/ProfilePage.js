import './ProfilePage.css';
import React, { useEffect, useState } from 'react';
// import { getUserPosts, getProfile, sendReply } from './ProfileModule';
// import { getProfile, getUserPosts, sendReply } from './ProfileModule';
// import './ProfileModule.js';
// import '../DatabaseModule';
// import { ReactHtmlParser } from 'react-html-parser';
// const database = require('../DatabaseModule');
// const profileModules = require('./ProfileModule');

const {
  getProfile,
  getUserPosts,
  sendReply,
  getRegistrationDate,
} = require('./ProfileModule');

function ProfilePage(props) {
  // dummy profile to help implement component frontend with right schema
  // define states
  const dummyProfile = {
    biography: '',
    first_name: 'Stacy',
    last_name: 'Shapiro',
    user_id: 9,
    profile_picture_url: 'https://www.psypost.org/wp-content/uploads/2017/08/meditating-woman.jpg',
  };

  const { changeState } = props;

  const [userProfile, setUserProfile] = useState(dummyProfile);
  const [userPosts, setUserPosts] = useState([]);
  const [registrationDate, setRegoDate] = useState('');

  const updateUserPosts = async () => {
    // extract id from props
    const { userId } = props.state;

    // const dummyId = 9;

    // call backend for content linked to userId
    const postsToSet = await getUserPosts(userId);
    const profileToSet = await getProfile(userId);

    // just for testing
    const regoDate = await getRegistrationDate(userId);
    // eslint-disable-next-line no-console
    console.log('user registration date is: ', regoDate);

    // update state
    setUserPosts(postsToSet);
    // don't know why I need to index it at all let alone double, gets the right data structure
    setUserProfile(profileToSet[0][0]);
    setRegoDate(regoDate);
  };

  useEffect(() => {
    updateUserPosts();
  }, []);

  // useEffect(async () => {
  //  console.log('state updated, userPosts is now: ', userPosts);
  // }, [userPosts]);

  return (
    <div className="App">
      <div id="cover_space">
        <img id="user_profile_pic" src={userProfile.profile_picture_url} alt="" />
        <div id="main_title">
          {`${userProfile.first_name} ${userProfile.last_name}`}
          &apos;s FaceTok Page
        </div>
      </div>
      <div id="nav_button_container">
        <div className="nav_button" onClick={() => changeState({ link: '/main' })} onKeyDown={() => changeState({ link: '/main' })} role="link" tabIndex={0}>Home</div>
        <div className="nav_button" onClick={() => changeState({ link: '/home' })} onKeyDown={() => changeState({ link: '/home' })} role="link" tabIndex={0}>Groups [active link] </div>
        <div className="nav_button">Update bio</div>
        <div className="nav_button" onClick={() => changeState({ link: '/changepassword', userId: userProfile.user_id })} onKeyDown={() => changeState({ link: '/changepassword', userId: userProfile.user_id })} role="link" tabIndex={0}>Change password or bio</div>
        <div className="nav_button" onClick={() => changeState({ link: '/deactivate-account' })} onKeyDown={() => changeState({ link: '/deactivate-account' })} role="link" tabIndex={0}>Deactivate account</div>
      </div>
      <div id="main_content_container">
        <div id="key_bio_info">
          <b>
            {userProfile.first_name}
            &apos;s bio
          </b>
          <p />
          {userProfile.biography}
          <p />
          <p />
          Account registration date:
          <p />
          {registrationDate}
        </div>
        <div id="post_container">
          {userPosts.map((post) => (
            <div className="wall_post">
              <b>
                <div className="main_post">
                  {`${userProfile.first_name} ${userProfile.last_name}`}
                  &nbsp;posted:
                </div>
              </b>
              <p />
              <div className="post_caption">
                {post.caption}
              </div>
              <div className="reply_content_container">
                { post.comments.map((comment) => (
                  <div>
                    <p />
                    <b className="reply_content_name">
                      {comment.name}
                    </b>
                    <div className="reply_text">
                      {comment.comment_txt}
                    </div>
                  </div>
                )) }
                <p />
                <div className="reply_container">
                  <div className="post_reply_textbox" id={`reply_for_post_${post.post_id}`}> Type your reply here...</div>

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
