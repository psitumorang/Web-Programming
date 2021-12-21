import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import Messages from '../messages-page/Messages';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Messages Page UI', () => {
  test('Messages page renders correctly', () => {
    const component = renderer.create(<Messages changeState={changeLink} state={{username: 'me', link: '/messages'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('Messages page error renders correctly', () => {
    const component = renderer.create(<Messages changeState={changeLink} state={{username: 'me', link: '/messages/error'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('Messages page group error renders correctly', () => {
    const component = renderer.create(<Messages changeState={changeLink} state={{username: 'me', link: '/messages/group'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('Messages page user error renders correctly', () => {
    const component = renderer.create(<Messages changeState={changeLink} state={{username: 'me', link: '/messages/user'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('Messages page img error renders correctly', () => {
    const component = renderer.create(<Messages changeState={changeLink} state={{username: 'me', link: '/messages/img'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('Messages page av error renders correctly', () => {
    const component = renderer.create(<Messages changeState={changeLink} state={{username: 'me', link: '/messages/av'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});