import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import RegistrationForm from '../registration-page/RegistrationForm';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('fetch and DOM testing with mocking', () => {
  test('login when passwords match', async () => {
    render(<Router><RegistrationForm changeLink={changeLink} /></Router>);
    document.getElementById('password1').value = 'password';
    document.getElementById('password2').value = 'password';
    document.getElementById('createButton').click();
    expect(changeLink).toBeCalled();
    expect(changeLink.mock.calls[0][0]).toBe('/main');
  });

  test('redirect when passwords do not match', async () => {
    render(<Router><RegistrationForm changeLink={changeLink} /></Router>);
    document.getElementById('password1').value = 'password';
    document.getElementById('password2').value = 'no match';
    document.getElementById('createButton').click();
    expect(changeLink).toBeCalled();
    expect(changeLink.mock.calls[0][0]).toBe('/registration/invalid');
  });
});
