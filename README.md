<div align="center">
  <h1>⚡️ ABOSS Events ⚡️</h1>
  <p><b>Javascript client to fetch ABOSS events.</b></p>
  
  <img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style&logo=TypeScript&logoColor=white" alt="TypeScript" />
  <img src="https://snyk.io/test/github/waspeer/aboss-events/badge.svg" alt"Known Vulnerabilities" />
  <img src="https://img.shields.io/github/license/waspeer/aboss-events?style&color=5D6D7E" alt="GitHub license" />
</div>

This package provides a small and simple client to fetch public events from the [ABOSS API](https://data.a-boss.net/). [ABOSS](https://www.a-boss.net/) is a platform for artist, managers and booking agents.

## Installation

To install, use one of the following commands:

```bash
npm install aboss-events
```

```bash
yarn add aboss-events
```

```bash
pnpm add aboss-events
```

## Usage

### Importing the Client

First, import the `createClient` function from the package:

```typescript
import { createClient } from 'aboss-api-client';
```

### Configuration

Create a client instance by providing the required configuration parameters:

```typescript
const client = createClient({
  agencyId: 'your_agency_id', // Optional
  artistId: 'your_artist_id', // Required
  token: 'your_api_token',    // Required
});
```

### Fetching Public Events

Fetch public events by calling the `publicEvents` method on the client instance. You can optionally pass a date range:

```typescript
const allEvents = await client.publicEvents();

const eventsIn2024 = await client.publicEvents({
  from: new Date('2024-01-01'),
  to: new Date('2024-12-31'),
});
```

## API Reference

### `createClient(config: AbossClientConfig): AbossEventsClient`

Creates and returns an ABOSS API client. Reference the [ABOSS API documentation](https://data.a-boss.net/#auth) for more information about finding your token. Please keep in mind that if the token is from an agency account, you must also provide the agency ID.

#### Parameters

- `config`: An object containing the client configuration.
  - `agencyId` (optional): The ID of the agency.
  - `artistId` (required): The ID of the artist.
  - `token` (required): The API token for authentication.

### `AbossEventsClient.publicEvents(options?: PublicEventsOptions): Promise<AbossEvent[]>`

Fetches public events for the configured artist. Note that both the `from` and `to` parameters should be provided if you want to filter events by date range. This is a limitation of the ABOSS API.

#### Parameters

- `options` (optional): An object to specify the date range for events.
  - `from`: The start date for the event range (inclusive).
  - `to`: The end date for the event range (inclusive).

#### Returns

A promise that resolves to an array of events. The Event object is fully typed according to the [ABOSS API documentation](https://data.a-boss.net/#public_events).

## Contributing

Contributions, whether in the form of code enhancements, bug fixes, or documentation, are always welcome! Here are the steps to get started:

1. Fork the project repository. This creates a copy of the project on your account that you can modify without affecting the original project.
2. Clone the forked repository to your local machine using a Git client like Git or GitHub Desktop.
3. Create a new branch with a descriptive name (e.g., `new-feature-branch` or `bugfix-issue-123`).
```sh
git checkout -b new-feature-branch
```
4. Make changes to the project's codebase.
5. Commit your changes to your local branch with a clear conventional commit message that explains the changes you've made.
```sh
git commit -m 'feat: Implemented new feature.'
```
6. Push your changes to your forked repository on GitHub using the following command
```sh
git push origin new-feature-branch
```
7. Create a new pull request to the original project repository. In the pull request, describe the changes you've made and why they are necessary. Make sure to update or add documentation and test as relevant. I will review your changes, provide feedback, or merge them into the main branch.

## License

[MIT](LICENSE) © Wannes Salomé