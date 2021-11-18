import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import RegistrationForm from '../registration-page/RegistrationForm';

/**
 * @jest-environment jsdom
 */

describe('Test RegistrationForm UI', () => {
  const changeState = jest.fn();
  test('Registration page renders correctly', () => {
    const component = renderer.create(<RegistrationForm changeState={changeState} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

jest.mock('../DatabaseModule');
const database = require('../DatabaseModule');
const lib = require('../registration-page/RegistrationModule');

describe('tests RegistrationModule', () => {
  const changeState = jest.fn();

  afterEach(() => {
    changeState.mockClear();
  });

  test('validatePassword match', async () => {
    const res = lib.validatePassword(changeState, 'password', 'password');
    expect(res).toBe(true);
  });

  test('validatePassword not match', () => {
    const res = lib.validatePassword(changeState, 'password', 'no match');
    expect(res).toBe(false);
    expect(changeState.mock.calls.length).toBe(1);
    expect(changeState.mock.calls[0][0]).toStrictEqual({link: '/registration/invalid'});
  });

  test('createAccount no errors', async () => {
    database.sendPostRequest.mockResolvedValue({});
    await lib.createAccount(changeState, 'mmclees', '1', '1');
    expect(changeState.mock.calls.length).toBe(1);
    expect(changeState.mock.calls[0][0]).toStrictEqual({link: '/'});
  });

  test('createAccount no matching passwords', async () => {
    await lib.createAccount(changeState, 'mmclees', '1', '2');
    expect(changeState.mock.calls.length).toBe(1);
    expect(changeState.mock.calls[0][0]).toStrictEqual({link: '/registration/invalid'});
  });

  test('createAccount username taken', async () => {
    database.sendPostRequest.mockResolvedValue({ err: 'there was an error' });
    await lib.createAccount(changeState, 'mmclees', '1', '1');
    expect(changeState.mock.calls.length).toBe(1);
    expect(changeState.mock.calls[0][0]).toStrictEqual({link: '/registration/user'});
  });
});
