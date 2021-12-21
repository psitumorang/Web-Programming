import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import FlaggedPosts from '../flagged-posts/FlaggedPosts';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Flagged Posts Page UI', () => {
  test('FlaggedPosts page renders correctly', () => {
    const component = renderer.create(<FlaggedPosts changeState={changeLink} state={{username: 'me'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});