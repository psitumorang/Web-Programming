import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import { getPostsComments, getProfile, getNamesFromDB, getUserPosts, sendReply } from '../profile-page/ProfileModule';
import ProfilePage from '../profile-page/ProfilePage';
import testUtils from 'react-dom/test-utils';
// mocking FetchData
jest.mock('../DatabaseModule.js');
const dbInterface = require('../DatabaseModule.js');

/**
 * @jest-environment jsdom
 */

// test getPostComments
test('test getPostComments', async () => {
  let userId = 1402304;
  dbInterface.sendGetRequest.mockResolvedValue([]);
  const testGPC = await getPostsComments(userId);
  expect(testGPC).toBe(1402304);
});

// test getProfile
test('test getProfile', async () => {
  dbInterface.sendGetRequest.mockResolvedValue(['blah test']);
  const testGP = await getProfile(1);
  expect(testGP).toStrictEqual(['blah test']);
});

// getNamesFromDb
test('test getNamesFromDb', async () => {
  const testProfile = {user_id: 53453, first_name: 'stace', last_name: 'place', biography: 'Wackie do!'};
  dbInterface.sendGetRequest.mockResolvedValue(testProfile);
  const testPostLst = [{
    post_id: 1,
    post_group: 1,
    posting_user: 1,
    caption: 'this is the first text message',
    comments: [],
  }];
  const testGP = await getNamesFromDB(testPostLst);
  expect(testGP).toStrictEqual(testPostLst);
});

// getUserPosts
test('test getUserPosts', async () => {
  const testPost = {
    post_id: 1,
    post_group: 1,
    posting_user: 1,
    caption: 'this is the first text message',
    comments: [],
  };
  dbInterface.sendGetRequest.mockResolvedValue(testPost);

  const testGUP = await getUserPosts(10082);
  expect(testGUP).toStrictEqual(testPost);
});

/** // send reply
test('test sendReply', async () => {
  const testPost = {
    post_id: 1,
    post_group: 1,
    posting_user: 1,
    caption: 'this is the first text message',
    comments: [],
  };
  dbInterface.sendPostRequest.mockResolvedValue(testPost);
  
  const testState = {
    link: '/',
    userId: 10,
    username: '',
    viewingGroup: -1,
    viewingConvo: { id: -1, otherUserId: -1 },
  };

  render(<ProfilePage state={testState} />);

  const testGUP = await sendReply(4353, 3456, 'commentTxt', () => (5));
  expect(testGUP).toStrictEqual(testPost);
}); */

// get registration date

//