import React from 'react';
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

/**
 * @jest-environment jsdom
 */
const lib = require('../DatabaseModule');

describe('Test DatbaseModule', () => {
  beforeEach(() => {
    enableFetchMocks();
  });

  test('test createUser success', async () => {
    fetchMock.mockResponse(JSON.stringify([{}]));
    const response = await lib.sendPostRequest('http://localhost:8080/registration', {});
    expect(response).toStrictEqual([{}]);
  });

  test('test createUser fail', async () => {
    fetchMock.mockReject(new Error('fake error message'));
    const response = await lib.sendPostRequest('http://localhost:8080/registration', {});
    expect(response).toBe(null);
  });
});
