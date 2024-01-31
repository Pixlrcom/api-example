# Pixlr API Example Application

This repository contains some example applications that utilizes the Pixlr API to perform various image editing tasks and demonstrates how to integrate Pixlr's functionality into a web application.

## Getting Started

To run this example application locally, follow these steps:

### Prerequisites

- Node.js and NPM installed on your machine
- Pixlr API key & secret

### Pixlr API key & secret

The application demonstrates how to authenticate with the Pixlr API, perform various image editing operations such as applying filters, adjusting colors, and saving edited images.

To get API key and secret:

1. Sign up for Pixlr: Visit Developer under My Account to create a key and secret pair.

2. Update `src/lib/token.server.ts` with your key & secret.

3. Refer to the code in this repository for examples of how to make requests to the Pixlr API and handle the responses.

### Setup

```bash
git clone https://github.com/pixlrcom/pixlr-api-example.git
cd pixlr-api-example/svelte-kit-example   or  cd pixlr-api-example/express-example
npm install
```

### Start

To start the example app, use the following command:

```bash
npm run dev
```
