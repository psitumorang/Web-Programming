import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewGroup from '../view-group-page/ViewGroup';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test View Group Page UI', () => {
  test('View group page renders correctly', () => {
    const component = renderer.create(<ViewGroup changeState={changeLink} state={{username: 'me', link: '/viewgroup', viewingGroup: 0}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('View group page error renders correctly', () => {
    const component = renderer.create(<ViewGroup changeState={changeLink} state={{username: 'me', link: '/viewgroup/error', viewingGroup: 0}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('View group page post error renders correctly', () => {
    const component = renderer.create(<ViewGroup changeState={changeLink} state={{username: 'me', link: '/viewgroup/post/error', viewingGroup: 0}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('View group page admin renders correctly', () => {
    const component = renderer.create(<ViewGroup changeState={changeLink} state={{username: 'me', link: '/viewgroup/admin', viewingGroup: 0}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});