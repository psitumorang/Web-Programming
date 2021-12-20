import React from 'react';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import AnalyticsPage from '../analytics-page/AnalyticsPage';

/**
 * @jest-environment jsdom
 */

const changeLink = jest.fn();

describe('Test Analytics Page UI', () => {
  test('Analytics page renders correctly', () => {
    const component = renderer.create(<AnalyticsPage changeState={changeLink} state={{username: 'me'}} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});