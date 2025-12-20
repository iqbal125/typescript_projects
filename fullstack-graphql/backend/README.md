# GraphQL Backend

A simple Apollo GraphQL server.

## Installation

```bash
npm install
```

## Development

Run the server in development mode with hot reload:

```bash
npm run dev
```

## Build

Build the TypeScript code:

```bash
npm run build
```

## Start

Run the production server:

```bash
npm start
```

The server will be available at `http://localhost:4000`

## GraphQL Playground

Once the server is running, you can access the Apollo Server GraphQL playground at:
`http://localhost:4000`

## Sample Queries

### Get all books
```graphql
query {
  books {
    id
    title
    author
  }
}
```

### Get a single book
```graphql
query {
  book(id: "1") {
    id
    title
    author
  }
}
```

### Add a new book
```graphql
mutation {
  addBook(title: "New Book", author: "John Doe") {
    id
    title
    author
  }
}
```
