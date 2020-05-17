module.exports = [
  {
    name: "development",
    synchronize: true,
    logging: true,

    type: "sqlite",
    database: "database.sqlite",
    // example using database hosted from heroku.
    // type: "postgres",
    // url:
    //   "postgres://examplehosturi.compute-1.amazonaws.com:5432/examplepassword",
    // extra: {
    //   ssl: true
    // },
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber"
    }
  },
  {
    name: "production",
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: false, // switch this to false once you have the initial tables created and use migrations instead
    logging: false,
    entities: ["dist/entity/**/*.js"],
    migrations: ["dist/migration/**/*.js"],
    subscribers: ["dist/subscriber/**/*.js"],
    cli: {
      entitiesDir: "dist/entity",
      migrationsDir: "dist/migration",
      subscribersDir: "dist/subscriber"
    }
  }
];
