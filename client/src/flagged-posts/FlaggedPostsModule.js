const database = require('../DatabaseModule');

const getFlaggedPostsForReview = async (state) => {
  const { flaggedPosts } = await database.sendGetRequest(`/flag-post/${state.userId}`);
  return flaggedPosts;
};

const finishFlag = async (flag, deleted, changeState) => {
  const body = {
    flaggerId: flag.flaggerName,
    flaggerName: flag.flaggerName,
    groupId: flag.groupId,
    deleted,
    author: flag.posting_username,
  };
  await database.sendBodiedDeleteRequest(`/flag-post/${flag.post_id}`, body);
  changeState({ link: '/flaggedposts' });
  return body;
};

const parseFlaggedPosts = (flagged, changeState) => {
  if (flagged.length !== 0) {
    const element = document.getElementById('post-create-area');

    if (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }

    // then add all the groups
    for (let i = 0; i < flagged.length; i += 1) {
      const post = flagged[i];
      const postId = post.post_id;
      const postingUser = post.posting_username;
      // eslint-disable-next-line prefer-destructuring
      const caption = post.caption;
      let content = '';
      if (flagged[i].photourl !== null) {
        content += `<div class="content image">
          <img src=${flagged[i].photourl} class="image" alt="${flagged[i].posting_username}'s image" />
        </div>`;
      } else if (flagged[i].audioUrl !== null) {
        content += `<div class="content audio">
          <audio controls>
            <source src=${flagged[i].audioUrl}>
          </audio>
        </div>`;
      } else if (flagged[i].videoUrl !== null) {
        content += `<div class="content video">
          <video src=${flagged[i].videoUrl} controls>
            Something went wrong!
          </video>
        </div>`;
      }

      // eslint-disable-next-line prefer-template
      const postBlock = '<div id="flag-container">'
    + `<p>Flagged by: ${flagged[i].flaggerName}</p>`
    + `<p>In group: ${flagged[i].groupName}</p>`
    + `<div class="post-container" id=${postId}>`
    + '<div class="post-info">'
    + '<ul>'
    + '<li id="post-id" >Post Id: '
    + postId
    + '</li>'
    + '<li id="posting-user">Posting User: '
    + postingUser
    + '</li>'
    + '<li id="caption">Caption: '
    + caption
    + '</li>'
    + '<li id="content">'
    + content
    + '</li>'
    + '</ul>'
    + '</div>'
    + '</div>'
    + '<div>'
    + '<input id="delete" type="submit" value="Delete post" />'
    + '<input id="keep" type="submit" value="Keep post" />'
    + '</div>'
    + '</div>';

      const postDiv = document.createElement('div');
      postDiv.innerHTML = postBlock;

      document.getElementById('post-create-area').appendChild(postDiv);
      document.getElementById('delete').onclick = () => finishFlag(flagged[i], 1, changeState);
      document.getElementById('keep').onclick = () => finishFlag(flagged[i], 0, changeState);
      // eslint-disable-next-line no-console
      console.log(document.getElementById(postId));
    }
  }
};

module.exports = {
  getFlaggedPostsForReview,
  parseFlaggedPosts,
};
