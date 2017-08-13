/**
 * from Zero to GraphQL in 30 Minutes – Steven Luscher
 */
"use strict";
const express = require("express");
const graphQLHTTP = require("express-graphql");
const DataLoader = require("dataloader");
const Promise = require("bluebird");

const schema = require("./graphqlschema.js");


const app = express();

const persons = [{
    firstname: "firstname1",
    lastname: "lastname1",
    email: "firstname1.lastname1@website.com",
    username: "username1",
    friends: [1,2]
  },
  {
    firstname: "firstname2",
    lastname: "lastname2",
    email: "firstname2.lastname2@website.com",
    username: "username2",
    friends: [0,2]
  },
  {
    firstname: "firstname3",
    lastname: "lastname3",
    email: "firstname3.lastname3@website.com",
    username: "username3",
    friends: [0,1]
}];

app.use(graphQLHTTP(req => {

  const personLoader = new DataLoader(
    keys => Promise.all(keys.map((id) => persons[id]))
  );

  const loaders = {
    person: personLoader
  };

  return {
    context: {loaders},
    schema,
    graphiql: true
  };
}));

app.listen(5000);
