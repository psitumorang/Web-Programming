import './ProfilePage.css';
import React, { useEffect, useState } from 'react';
// import '../DatabaseModule';
// import { ReactHtmlParser } from 'react-html-parser';

const database = require('../DatabaseModule');

/**
const dummyProfile = () => {
  changes to API
  // 1) add profile picture
  // 2) possible to have posts without pictures
  // 3) make some profile attributes lists of ids rather than actual entire objects.
  // 4) Is it the picture URL locally on the client-side, or on the server-side/in the DB?
  // 5) post on ABC's wall
  // 6) dummy photo list vs. dummy post list
  // 7) profiles as one big bundle (harder?) vs.
  // the profile page making 3-4 discrete calls based on userID to different types of content

  const dummyLikesOnPost = [{ id: '213407fv', username: 'Yide Zhao',
  password: '2394vbkjs' }, { id: '213dg407fv', username: 'Professor Fouh', password: '2394vbkjs' }];
  const dummyCommentsOnPost = [{ user: 'Yide Zhao', commentary:
  'OMG! Stacy I can\'t believe you did that! You absolute menace', id: '5h342' },
    { user: 'Professor Fouh', commentary: 'Have you seen D\'Amelio\'s latest OOTD? \
    Looks just like it!', id: '923fvh' }]; // user attribute to be updated later

  const dummyID = '1239872sdfgt34518237';
  const dummyFriendList = [{ id: '213407fv', username: 'Yide Zhao', password: '2394vbkjs' },
  { id: '213dg407fv', username: 'Professor Fouh', password: '2394vbkjs' }];
  const dummyUsername = 'Stacy Shapiro';
  const dummyPostList = [{
    picture: 'whitegalwastedv2.jfif',
    id: '0273kjhf',
    caption: 'It\'s a dangerous day to be a Whiteclaw! From Sweetgreen to feeling #mean',
    comments: dummyCommentsOnPost,
    likes: dummyLikesOnPost,
  }];
  const dummyGroupList = []; // to be implemented later
  const dummyBiographicalInfo = function () {
    (
      <div>
        Hi! I&apos;m Stacy!
        <p />
        I&apos;m an Eat,
        <p />
        Pray
      </div>
    );
  };

  const dummyPhotoList = [{}]; // to be implemented later

  const dummyNotifications = {};// to be implemented later

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
}; */

// get comments for a post
const getPostsComments = async (posts) => {
  // iterate through each post, requesting its comments. Wait for all promises to resolve.
  const commentPromiseContainer = [];
  for (let i = 0; i < posts.length; i += 1) {
    // need to implement a get comments function first
    const postComments = database.sendGetRequest('http://localhost:8080/comment/', { id: posts[i].post_id });
    commentPromiseContainer.push(postComments);
  }
  const commentFulfilledContainer = await Promise.all(commentPromiseContainer);

  // assign the comments to each post in the array to hand back
  const postsArray = posts;
  for (let i = 0; i < commentFulfilledContainer.length; i += 1) {
    postsArray[i].comments = commentFulfilledContainer[i];
  }
  // return the array of posts which now each have the additional 'comments' property
  // comments property is itself an array of comment objects
  return postsArray;
};

// get posts to display and their associated comments
const getUserPosts = async (userId) => {
  // get posts
  const userPosts = await database.sendGetRequest('http://localhost:8080/post/', { id: userId });

  // get comments
  const postsArray = await getPostsComments(userPosts);
  return postsArray;
};

const getProfile = async (userId) => {
  const profile = await database.sendGetRequest('http://localhost:8080/post/', { id: userId });
  return profile;
};

function ProfilePage(props) {
  // dummy profile to help implement component frontend with right schema
  // define states
  const [userProfile, setUserProfile] = useState({ biography: '', username: 'Stacy Shapiro' });
  const [userPosts, setUserPosts] = useState([]);
  // useState(getUserPosts());

  // when use .then vs. async/await. How to solve this problem?

  console.log('userPosts state variable: ', userPosts);
  console.log('props variable: ', props);

  useEffect(async () => {
    // extract id from props
    console.log('props is: ', props);
    const { userId } = props.state;

    // call backend for content linked to userId
    const postsToSet = await getUserPosts(userId);
    const profileToSet = await getProfile(userId);
    console.log('postsToSet in useffect is: ', postsToSet);

    // update state
    setUserPosts(postsToSet);
    setUserProfile(profileToSet);
  }, []);

  useEffect(async () => {
    console.log('state updated, userPosts is now: ', userPosts);
  }, [userPosts]);

  return (
    <div className="App">
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
          {userProfile.biography}
        </div>
        <div id="post_container">
          {userPosts.map((post) => {
            console.log('printing post in render: ', post);
            return (
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
                      <b className="post_content_name">{comment.user_id}</b>
                      <div>
                        {comment.comment_txt}
                      </div>
                    </div>
                  )) }
                  <p />
                  <div className="reply_container">
                    <div className="post_reply_textbox"> Type your reply here...</div>
                    <div className="post_reply_button">Reply!</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
