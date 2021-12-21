const database = require('../DatabaseModule');

// get comments for a post
const getPostsComments = async (posts) => {
  // iterate through each post, requesting its comments. Wait for all promises to resolve.
  const commentPromiseContainer = [];
  for (let i = 0; i < posts.length; i += 1) {
    // need to implement a get comments function first
    const postComments = database.sendGetRequest('/comment/', { id: posts[i].post_id });
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

const getProfile = async (userId) => {
  const profile = await database.sendGetRequest('/profile/', { id: userId });
  return profile;
};

const getNamesFromDB = async (postsToSet) => {
  // set up array of unique userIds for which to retrieve names from Db
  const userIdsToRetrieve = [];

  // loop through and get the userIds of the comment-makers
  for (let i = 0; i < postsToSet.length; i += 1) {
    // console.log('in get outerloop names, postsToSet[i].comments are: ', postsToSet[i].comments);
    for (let j = 0; j < postsToSet[i].comments.length; j += 1) {
      if (userIdsToRetrieve.indexOf(postsToSet[i].comments[j].user_id) === -1) {
        userIdsToRetrieve.push(postsToSet[i].comments[j].user_id);
        // console.log('pushing ', postsToSet[i].comments[j].user_id, 'to userIdsToRetrieve');
      }
    }
  }

  // get the names associated with all the userIds needed on the page
  // console.log('about to go populate promise container with ', userIdsToRetrieve);
  const profilePromiseContainer = [];
  for (let i = 0; i < userIdsToRetrieve.length; i += 1) {
    const commenterProfile = getProfile(userIdsToRetrieve[i]);
    // console.log(' about to push ', commenterProfile, ' onto the profilePromiseContainer');
    profilePromiseContainer.push(commenterProfile);
  }

  const profileFulfilledContainer = await Promise.all(profilePromiseContainer);

  // taking one level off the array - not sure why it's got an extra nesting?
  const profilesToReturn = [];
  for (let i = 0; i < profileFulfilledContainer.length; i += 1) {
    profilesToReturn.push(profileFulfilledContainer[i][0][0]);
  }

  // attach the names to each comment
  const postsToReturn = postsToSet;
  for (let i = 0; i < postsToReturn.length; i += 1) {
    for (let j = 0; j < postsToReturn[i].comments.length; j += 1) {
      // const index = profilesToReturn.userId.indexOf(postsToReturn[i][j].user_id);
      const idToFind = postsToReturn[i].comments[j].user_id;
      const index = profilesToReturn.map((profile) => (profile.user_id)).indexOf(idToFind);
      const firstName = profilesToReturn[index].first_name;
      const lastName = profilesToReturn[index].last_name;
      postsToReturn[i].comments[j].name = `${firstName} ${lastName}`;
      // console.log('just assigned sally at postsToReturn[i].comments[j] of
      // ', postsToReturn[i].comments[j]);
    }
  }

  return postsToReturn;
};

// get posts to display and their associated comments
const getUserPosts = async (userId) => {
  // get posts
  const userPosts = await database.sendGetRequest('/post/', { id: userId });

  // get comments
  const postsArray = await getPostsComments(userPosts);

  // get / attach the names to each comment
  const postsArrayWithNames = await getNamesFromDB(postsArray);

  return postsArrayWithNames;
};

const sendReply = async (postId, userId, commentTxt, updateUserPosts) => {
  const replyBody = {
    post_id: postId,
    user_id: userId,
    comment_txt: document.getElementById(`post_${postId}`).value,
  };

  const callPostReply = await database.sendPostRequest('/comment/', replyBody);

  updateUserPosts();
  return callPostReply;

  // this structure in a Javascript Object: post_id: req.body.post_id,
  //    user_id: req.body.user_id,
  //    comment_txt: req.body.comment_txt,
  // (8, 6, 9, "That's THEFT!")
};

const getRegistrationDate = async (userId) => {
  // eslint-disable-next-line no-console
  console.log('at ProfileModule/getRegistrationDate with userId', userId);
  const userLst = await database.sendGetRequest('/user/', { id: userId });
  // eslint-disable-next-line no-console
  console.log('back from sendGetRequest, with userLst of:', userLst);
  const registrationDate = userLst[0].registration_date.slice(0, 10);
  return registrationDate;
};

export {
  getUserPosts,
  getProfile,
  sendReply,
  getRegistrationDate,
  getPostsComments,
  getNamesFromDB,
};
