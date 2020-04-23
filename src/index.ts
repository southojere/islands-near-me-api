import "reflect-metadata";
import { createConnection, getConnectionOptions } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";

import { RegisterResolver } from "./resolvers/user/Register";
import { LoginResolver } from "./resolvers/user/Login";
import { MeResolver } from "./resolvers/user/Me";

import { SessionResolver } from "./resolvers/Session";

import { findUserById } from "./entity/queries/user";
import config from "./config";

(async () => {
  const app = express();
  var corsOptions = {
    origin: "*",
    credentials: true
  };
  app.use(cors(corsOptions));
  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" });

  app.use(cookieParser());

  const addUser = async (req: any, _: any, next: any) => {
    let accessToken = req.headers.authorization
      ? req.headers.authorization.split(" ")[1] // remove 'Bearer'
      : null;
    const accessTokenViaCookie = req.cookies["access-token"];
    if (accessTokenViaCookie) {
      console.log("[AuthCheck] Found accessToken via cookie");
      console.log(accessTokenViaCookie);
      accessToken = accessTokenViaCookie;
    }
    if (accessToken) {
      console.log(accessToken);
      try {
        const { userId }: any = jwt.verify(accessToken, config.auth.secret);
        const user = await findUserById(userId);
        console.log(user)
        req.user = user;
      } catch (err) {}
    }
    next();
  };

  app.use(addUser);

  const apolloServer = new ApolloServer({
    introspection: true,
    playground: true,
    schema: await buildSchema({
      resolvers: [RegisterResolver, LoginResolver, MeResolver, SessionResolver],
      validate: true,
      authChecker: ({ context }) => {
        const user = context.user;
        if (!user) return false;
        // TODO add more custom auth logic here
        return true;
      }
    }),
    context: ({ req, res }: any) => {
      return { req, res, user: req.user };
    }
  });

  apolloServer.applyMiddleware({ app, cors: false });
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/graphql`);
  });
})();
