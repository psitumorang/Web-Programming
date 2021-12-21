import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import Conversation from '../conversation-page/Conversation';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Conversation Page UI', () => {
  test('Conversation page renders correctly', () => {
    const component = renderer.create(<Conversation changeState={changeLink} state={{username: 'me', link: '/conversation', viewingConvo: { id: 0, otherUserId: 1} }} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('Conversation page img error renders correctly', () => {
    const component = renderer.create(<Conversation changeState={changeLink} state={{username: 'me', link: '/conversation/img', viewingConvo: { id: 0, otherUserId: 1}}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
    
  test('Conversation page av error renders correctly', () => {
    const component = renderer.create(<Conversation changeState={changeLink} state={{username: 'me', link: '/conversation/av', viewingConvo: { id: 0, otherUserId: 1}}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});