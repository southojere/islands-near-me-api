# Typescript GraphQL API with basic Auth Boilerplate

Make sure to configure your ormconfig.js file.

#Tech
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