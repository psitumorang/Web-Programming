import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from '../home-page/Home';

/**
 * @jest-environment jsdom
 */

const changeState = jest.fn();

describe('Test Home Page UI', () => {
  test('change link called when notification button clicked', async () => {
    render(<Router><Home changeState={changeState} /></Router>);
    document.getElementsByClassName('notifications')[0].click();
    expect(changeState).toBeCalled();
    expect(changeState.mock.calls[0][0]).toStrictEqual({link: '/notifications'});
  });

  test('Home page renders correctly', () => {
    const component = renderer.create(<Home changeState={changeState} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
