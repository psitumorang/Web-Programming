import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import MainPage from '../MainPage';

/**
 * @jest-environment jsdom
 */

describe('Test MainPage UI', () => {
  test('MainPage page renders correctly', () => {
    const component = renderer.create(<MainPage />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
