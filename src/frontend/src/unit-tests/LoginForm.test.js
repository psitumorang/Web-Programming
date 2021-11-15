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
  afterEach(() => {
    changeLink.mockClear();
  });

  test('change link called when login clicked', async () => {
    render(<Router><LoginForm changeLink={changeLink} /></Router>);
    document.getElementById('loginButton').click();
    expect(changeLink).toBeCalled();
    expect(changeLink.mock.calls[0][0]).toBe('/main');
  });

  test('change link called when registration link clicked', async () => {
    render(<Router><LoginForm changeLink={changeLink} /></Router>);
    document.getElementById('registrationLink').click();
    expect(changeLink).toBeCalled();
    expect(changeLink.mock.calls[0][0]).toBe('/registration');
  });

  test('Login page renders correctly', () => {
    const component = renderer.create(<Router><LoginForm changeLink={changeLink} /></Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
