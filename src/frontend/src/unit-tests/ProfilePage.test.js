import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfilePage from '../profile-page/ProfilePage';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Profile Page UI', () => {
  test('Profile page renders correctly', () => {
    const component = renderer.create(<ProfilePage />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
