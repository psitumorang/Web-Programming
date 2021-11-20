import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from '../login-page/LoginForm';

/**
 * @jest-environment jsdom
 */

const changeState = jest.fn();

describe('Test Login Form UI', () => {
  test('Login page renders correctly', () => {
    const component = renderer.create(<Router><LoginForm changeState={changeState} /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

jest.mock('../DatabaseModule');
const database = require('../DatabaseModule');
const lib = require('../login-page/LoginModule');

describe('Test LoginModule', () => {
  afterEach(() => {
    changeState.mockClear();
  });

  test('verify user success', async () => {
    database.sendPostRequest.mockResolvedValue({ profile: {user_id: 3} });
    render(<Router><LoginForm changeState={changeState} /></Router>);
    const response = await lib.verifyUser(changeState, 'mcleesm', 'abc');
    expect(changeState).toBeCalled();
    expect(changeState.mock.calls[0][0]).toStrictEqual({link: '/main', userId: 3});
  });

  test('verify user wrong username', async () => {
    database.sendPostRequest.mockResolvedValue({ err: 'user does not exist' });
    render(<Router><LoginForm changeState={changeState} /></Router>);
    const response = await lib.verifyUser(changeState, 'mcleesm', 'abc');
    expect(changeState).toBeCalled();
    expect(changeState.mock.calls[0][0]).toStrictEqual({link: '/error'});
  });

  test('verify user wrong password', async () => {
    database.sendPostRequest.mockResolvedValue({ err: 'password incorrect' });
    render(<Router><LoginForm changeState={changeState} /></Router>);
    const response = await lib.verifyUser(changeState, 'mcleesm', 'abc');
    expect(changeState).toBeCalled();
    expect(changeState.mock.calls[0][0]).toStrictEqual({link: '/error'});
  });
});
