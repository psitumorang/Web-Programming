import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginForm from '../login-page/LoginForm';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Login Form UI', () => {
  test('Login page renders correctly', () => {
    const component = renderer.create(<Router><LoginForm changeLink={changeLink} /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

jest.mock('../DatabaseModule');
const database = require('../DatabaseModule');
const lib = require('../login-page/LoginModule');

describe('Test LoginModule', () => {
  afterEach(() => {
    changeLink.mockClear();
  });

  test('verify user success', async () => {
    database.sendPostRequest.mockResolvedValue({ user: {} });
    render(<Router><LoginForm changeLink={changeLink} /></Router>);
    const response = await lib.verifyUser(changeLink, 'mcleesm', 'abc');
    expect(changeLink).toBeCalled();
    expect(changeLink.mock.calls[0][0]).toBe('/main');
  });

  test('verify user wrong username', async () => {
    database.sendPostRequest.mockResolvedValue({ err: 'user does not exist' });
    render(<Router><LoginForm changeLink={changeLink} /></Router>);
    const response = await lib.verifyUser(changeLink, 'mcleesm', 'abc');
    expect(changeLink).toBeCalled();
    expect(changeLink.mock.calls[0][0]).toBe('/error');
  });

  test('verify user wrong password', async () => {
    database.sendPostRequest.mockResolvedValue({ err: 'password incorrect' });
    render(<Router><LoginForm changeLink={changeLink} /></Router>);
    const response = await lib.verifyUser(changeLink, 'mcleesm', 'abc');
    expect(changeLink).toBeCalled();
    expect(changeLink.mock.calls[0][0]).toBe('/error');
  });
});
