import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import RegistrationForm from '../registration-page/RegistrationForm';

/**
 * @jest-environment jsdom
 */

describe('Test RegistrationForm UI', () => {
  const changeLink = jest.fn();
  test('Registration page renders correctly', () => {
    const component = renderer.create(<RegistrationForm changeLink={changeLink} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

jest.mock('../DatabaseModule');
const database = require('../DatabaseModule');
const lib = require('../registration-page/RegistrationModule');

describe('tests RegistrationModule', () => {
  const changeLink = jest.fn();

  afterEach(() => {
    changeLink.mockClear();
  });

  test('validatePassword match', async () => {
    const res = lib.validatePassword(changeLink, 'password', 'password');
    expect(res).toBe(true);
  });

  test('validatePassword not match', () => {
    const res = lib.validatePassword(changeLink, 'password', 'no match');
    expect(res).toBe(false);
    expect(changeLink.mock.calls.length).toBe(1);
    expect(changeLink.mock.calls[0][0]).toBe('/registration/invalid');
  });

  test('createAccount no errors', async () => {
    database.createUser.mockResolvedValue({});
    await lib.createAccount(changeLink, 'mmclees', '1', '1');
    expect(changeLink.mock.calls.length).toBe(1);
    expect(changeLink.mock.calls[0][0]).toBe('/');
  });

  test('createAccount no matching passwords', async () => {
    await lib.createAccount(changeLink, 'mmclees', '1', '2');
    expect(changeLink.mock.calls.length).toBe(1);
    expect(changeLink.mock.calls[0][0]).toBe('/registration/invalid');
  });

  test('createAccount username taken', async () => {
    database.createUser.mockResolvedValue({ err: 'there was an error' });
    await lib.createAccount(changeLink, 'mmclees', '1', '1');
    expect(changeLink.mock.calls.length).toBe(1);
    expect(changeLink.mock.calls[0][0]).toBe('/registration/user');
  });
});
