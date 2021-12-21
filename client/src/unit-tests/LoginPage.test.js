import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from '../login-page/LoginPage';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Login Page UI', () => {
  test('Login page renders correctly', () => {
    const component = renderer.create(<LoginPage changeState={changeLink} state={{link: '/'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});