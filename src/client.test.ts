import { http, HttpResponse } from 'msw';
import type { ResponseResolver } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import type { AbossClientConfig } from './client.js';
import { createClient } from './client.js';
import { API_BASE_URL } from './constants.js';

// MOCK SERIVCE WORKER
// -------------------

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// TESTS
// -----

test('Fetches public events for artists', async () => {
  const { client, useValidateRequest } = createTestClient();

  const validateRequest = useValidateRequest({
    resourcePath: 'public_events',
    searchParams: new URLSearchParams({
      from: '2024-1-1',
      to: '2024-1-31',
    }),
    handler: () => {
      return HttpResponse.json([{ id: '1' }, { id: '2' }]);
    },
  });

  const events = await client.publicEvents({
    from: new Date('2024-01-01'),
    to: new Date('2024-01-31'),
  });

  validateRequest();
  expect(events).toHaveLength(2);
});

test('Fetches public events for agencies', async () => {
  const { client, useValidateRequest } = createTestClient({ agencyId: true });

  const validateRequest = useValidateRequest({
    resourcePath: 'public_events',
    searchParams: new URLSearchParams({
      from: '2024-1-1',
      to: '2024-1-31',
    }),
    handler: () => {
      return HttpResponse.json([{ id: '1' }, { id: '2' }]);
    },
  });

  const events = await client.publicEvents({
    from: new Date('2024-01-01'),
    to: new Date('2024-01-31'),
  });

  validateRequest();
  expect(events).toHaveLength(2);
});

// UTILS
// -----

function randomString() {
  return Math.random().toString(36).substring(7);
}

function createTestClient(
  overrides: Omit<Partial<AbossClientConfig>, 'agencyId'> & {
    agencyId?: string | number | boolean;
  } = {},
) {
  // Create a random client configuration.
  const config: AbossClientConfig = {
    artistId: overrides.artistId ?? randomString(),
    agencyId: overrides.agencyId === true ? randomString() : overrides.agencyId || undefined,
    token: overrides.token ?? randomString(),
  };

  // Create a client instance with the random configuration.
  const client = createClient(config);

  // Create a utility function to validate the request URL and headers.
  function useValidateRequest({
    resourcePath,
    searchParams,
    handler,
  }: {
    resourcePath: string;
    searchParams?: URLSearchParams;
    handler: ResponseResolver;
  }) {
    // Create the expected request URL.
    const collectionPath = config.agencyId
      ? `agency/${config.agencyId}/${config.artistId}/`
      : `artist/${config.artistId}/`;
    const collectionUrl = new URL(collectionPath, API_BASE_URL);
    const url = new URL(resourcePath, collectionUrl);

    if (searchParams) {
      url.search = searchParams.toString();
    }

    // Intercept the request and execute the handler.
    let interceptedRequest: Request;

    server.use(
      http.get(/.*/, ({ request, requestId }) => {
        interceptedRequest = request;
        return handler({ request, requestId });
      }),
    );

    // Return a function to validate the request.
    // This is returned as a function to be executed because if this test fails,
    // the test runner will pick up the error correctly and display it.
    return () => {
      expect(interceptedRequest.url).toBe(url.toString());
      expect(interceptedRequest.headers.get('authorization')).toBe(`Bearer ${config.token}`);
    };
  }

  return {
    useValidateRequest,
    config,
    client,
  };
}
