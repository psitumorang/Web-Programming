import './ProfilePage.css';
import React, { useState } from 'react';
// import { ReactHtmlParser } from 'react-html-parser';

const dummyProfile = () => {
  /* changes to API
  // 1) add profile picture
  // 2) possible to have posts without pictures
  // 3) make some profile attributes lists of ids rather than actual entire objects.
  // 4) Is it the picture URL locally on the client-side, or on the server-side/in the DB?
  // 5) post on ABC's wall
  // 6) dummy photo list vs. dummy post list */

  const dummyLikesOnPost = [{ id: '213407fv', username: 'Yide Zhao', password: '2394vbkjs' }, { id: '213dg407fv', username: 'Professor Fouh', password: '2394vbkjs' }];
  const dummyCommentsOnPost = [{ user: 'Yide Zhao', commentary: 'OMG! Stacy I can\'t believe you did that! You absolute menace' },
    { user: 'Professor Fouh', commentary: 'Have you seen D\'Amelio\'s latest OOTD? Looks just like it!' }]; // user attribute to be updated later

  const dummyID = '1239872sdfgt34518237';
  const dummyFriendList = [{ id: '213407fv', username: 'Yide Zhao', password: '2394vbkjs' }, { id: '213dg407fv', username: 'Professor Fouh', password: '2394vbkjs' }];
  const dummyUsername = 'Stacy Shapiro';
  const dummyPostList = [{
    picture: 'whitegalwastedv2.jfif',
    id: '0273kjhf',
    caption: 'It\'s a dangerous day to be a Whiteclaw! From Sweetgreen to feeling #mean',
    comments: dummyCommentsOnPost,
    likes: dummyLikesOnPost,
  }];
  const dummyGroupList = []; // to be implemented later
  const dummyBiographicalInfo = '<div> Hi! I\'m Stacy! I\'m an Eat, Pray, Love kind of gal but also like a bit of quantum physics on the side.'
                          + '<p/> Went to undergrad at Penn and now out to get #whitegirlwasted with my ladies </div>';
  const dummyPhotoList = [{ }]; // to be implemented later

  const dummyNotifications = { };// to be implemented later

  const profileToReturn = {
    friendlist: dummyFriendList,
    username: dummyUsername,
    id: dummyID,
    postList: dummyPostList,
    groupList: dummyGroupList,
    biographicalInfo: dummyBiographicalInfo,
    photoList: dummyPhotoList,
    notifications: dummyNotifications,
  };

  return profileToReturn;
};

function ProfilePage() {
  // dummy profile to help implement component frontend with right schema
  // define states
  const [userProfile, setUserProfile] = useState(dummyProfile());

  // dummy function call to avoid eslint errors
  if (userProfile.biographicalInfo === 'blah!dfl') {
    setUserProfile(userProfile);
  }

  return (
    <div className="App">
      <header className="App-header" />
      <body>
        <div id="cover_space">
          <img id="user_profile_pic" src="Stacy meditating.jpg" alt="" />
          <div id="main_title">
            {userProfile.username}
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
            { userProfile.biographicalInfo }
          </div>
          <div id="post_container">
            {userProfile.postList.map((post) => (
              <div className="wall_post">
                <img className="wall_post_pic" src={post.picture} alt="" />
                <p />
                <div className="post_caption">
                  {post.caption}
                </div>
                <div className="post_content_container">
                  {post.comments.map((comment) => (
                    <div>
                      <p />
                      <b className="post_content_name">{comment.user}</b>
                      <div>
                        {comment.commentary}
                      </div>
                    </div>
                  ))}
                  <p />
                  <div className="reply_container">
                    <div className="post_reply_textbox"> Type your reply here...</div>
                    <div className="post_reply_button">Reply!</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Yide Zhao </b>
                <p className="post_content_message">OMG Stacy I can&apos;t believe you did that! You&apos;re so out there! #girlboss</p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
            </div>
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Charlotte Dagabond </b>
                <p className="post_content_message">Stacy I hope you survived last night! </p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
            </div>
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Bruce Yang </b>
                <p className="post_content_message">I&apos;m still cleaning up those vomit stains. I&apos;ll venmo you when I know the damage. </p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
            </div>
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Professor Eric </b>
                <p className="post_content_message">Have you seen D&apos;Amelio&apos;s latest OOTD?</p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
            </div>
            <div className="wall_post">
              <div className="post_content_container">
                <b className="post_content_name"> Turing Von Neumann </b>
                <p className="post_content_message">I&apos;m still shocked that you managed to prove Goldbach&apos;s conjecture on a napkin 8 margs in!</p>
                <div className="reply_container">
                  <div className="post_reply_textbox"> Type your reply here...</div>
                  <div className="post_reply_button">Reply!</div>
                </div>
              </div>
              <p />
            </div>
          </div>
        </div>
      </body>
    </div>
  );
}

export default ProfilePage;

/* const deprecatedBioString = '<b> Stacy&apos;s bio </b> \
<p> \
  I&apos;m just a wild eat pray love gal who also enjoys a \
  bit of nuclear physics on the side! \
</p> \
<p> Penn: Class of 2019 </p> \
<p> NASA: 2020 - 2021 </p> \
<p> Chardy&apos;s with the gals: FOREVER!! </p>'; */
