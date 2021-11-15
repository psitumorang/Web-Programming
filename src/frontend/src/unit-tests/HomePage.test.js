import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../home-page/Home';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('fetch and DOM testing with mocking', () => {
  test('change link called when updates button clicked', async () => {
    render(<Router><Home changeLink={changeLink} /></Router>);
    document.getElementsByClassName('updates')[0].click();
    expect(changeLink).toBeCalled();
    expect(changeLink.mock.calls[0][0]).toBe('/updates');
  });
});
