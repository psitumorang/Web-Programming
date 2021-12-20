import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import NotificationPage from '../notifications-page/NotificationPage';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Notifiations Page UI', () => {
  test('Notifiations page renders correctly', () => {
    const component = renderer.create(<NotificationPage changeState={changeLink} state={{username: 'me'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});