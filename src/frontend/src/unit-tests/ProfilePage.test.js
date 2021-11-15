import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import ProfilePage from '../ProfilePage';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('fetch and DOM testing with mocking', () => {
  test('Profile page renders correctly', () => {
    const component = renderer.create(<ProfilePage />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
