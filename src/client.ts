import { format as formatDate } from 'date-fns';

const API_BASE_URL = 'https://data.a-boss.net/v1/';

// CLIENT
// ------

export interface AbossClientConfig {
  agencyId?: string | number;
  artistId: string | number;
  token: string;
}

export function createClient({ agencyId, artistId, token }: AbossClientConfig) {
  const collectionPath = agencyId ? `agency/${agencyId}/${artistId}/` : `artist/${artistId}/`;
  const collectionUrl = new URL(collectionPath, API_BASE_URL);

  const fetcherConfig: FetcherConfig = {
    collectionUrl,
    token,
  };

  return {
    publicEvents: createPublicEventsFetcher(fetcherConfig),
  };
}

// FETCHERS
// --------

interface FetcherConfig {
  collectionUrl: URL;
  token: string;
}

interface FetchOptions {
  collectionUrl: URL;
  resourcePath: string;
  token: string;
  searchParams?: URLSearchParams;
}

async function fetchResource<Data = any>({
  collectionUrl,
  resourcePath,
  searchParams,
  token,
}: FetchOptions) {
  const url = new URL(resourcePath, collectionUrl);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return await fetch(url.toString(), {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json() as Promise<Data>;
  });
}

// PUBLIC EVENTS

// https://data.a-boss.net/#intro
export interface AbossEvent {
  id: string; // Event ID
  project: string; // Project Title
  title: string; // Event Title
  eventType: string; // Event Type
  start: string; // Event Start DateTime
  end: string; // Event End DateTime
  tba: boolean; // true or false
  allday: boolean; // true or false
  status: string; // Event Status
  website: string; // Event Website URL
  occupancyRate: number; // Occupancy Rate in percentage
  ticketLink: string; // Ticket URL
  soldOut: boolean; // true or false
  location: {
    title: string; // Location Title
    country: string; // Location Country
    city: string; // Location City
    website: string; // Location Website
  };
  lineUp: string | null; // Event Line-Up
  projectSite: string; // Project Website
  publicNotes: string | null; // Public Notes;
}

interface PublicEventsOptions {
  from?: Date;
  to?: Date;
}

function createPublicEventsFetcher({ collectionUrl, token }: FetcherConfig) {
  return async function fetchPublicEvents({ from, to }: PublicEventsOptions = {}) {
    const searchParameters = new URLSearchParams();

    if (from) {
      searchParameters.set('from', formatDate(from, 'Y-M-d'));
    }

    if (to) {
      searchParameters.set('to', formatDate(to, 'Y-M-d'));
    }

    const fetchOptions: FetchOptions = {
      collectionUrl,
      token,
      resourcePath: 'public_events',
      searchParams: searchParameters,
    };

    return await fetchResource<AbossEvent[]>(fetchOptions);
  };
}
