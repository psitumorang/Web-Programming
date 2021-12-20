import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import InvitationPage from '../invitations-page/InvitationPage';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Invitation Page UI', () => {
  test('Invitation page renders correctly', () => {
    const component = renderer.create(<InvitationPage changeState={changeLink} state={{username: 'me'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});