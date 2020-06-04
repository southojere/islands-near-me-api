# Islands Near Me

Animal Crossing New Horizons web app for finding other joinable sessions.

Board: https://trello.com/b/JMMPCFdD/islandnearme

# Running

1) yarn
2) yarn start:dev

# Tech
- TypeGraphQL
- TypeORM 
- Typescript
- Postgres DB
- JWT/Cookies for auth
- GraphQL

## Folder Structure

```
+-- src
|   +-- config (all the app config)
|   +-- resolvers
|   |   +-- Resolver - contains mutations (any update / insert) & queries (how to get the resource)
|   +-- libs (internal libs)
|   +-- entity
|   |   +-- commands (any database update)
|   |   +-- queries (any database read)
|   |   +-- XXX.ts (one Model entity)
+-- index.js (entrypoint)
```