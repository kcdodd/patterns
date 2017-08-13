"use strict";
const graphql = require("graphql");

const PersonType = new graphql.GraphQLObjectType({
  name: "Person",
  description: "...",
  fields: () => ({
    firstname: {
      type: graphql.GraphQLString
    },
    lastname: {
      type: graphql.GraphQLString
    },
    email: {type: graphql.GraphQLString},
    username: {type: graphql.GraphQLString},
    friends: {
      type: new graphql.GraphQLList(PersonType),
      resolve: (person, args, {loaders}) => loaders.person.loadMany(person.friends)
    }
  })
});

const QueryType = new graphql.GraphQLObjectType({
  name: "Query",
  description: "...",
  fields: () => ({
    person: {
      type: PersonType,
      args: {
        id: {type: graphql.GraphQLInt}
      },
      resolve: (root, args, {loaders}) => loaders.person.load(args.id)
    }
  })
});

module.exports = new graphql.GraphQLSchema({
  query: QueryType
});
