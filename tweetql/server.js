import { ApolloServer, gql } from "apollo-server";

// mockdata
let tweets = [
  {
    id: "1",
    text: "1st text",
    userId: "2",
  },
  {
    id: "2",
    text: "2nd text",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "yj",
    lastName: "lee",
  },
  {
    id: "2",
    firstName: "steve",
    lastName: "jobs",
  },
];
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, args) {
      console.log(args); // { id: '1' }
      const { id } = args;
      return tweets.find((tweet) => tweet.id === id);
      // 원래는 DB에서 데이터를 가져오는 쿼리문을 실행시킴
    },
    allUsers() {
      console.log("allUsers called!");
      return users;
    },
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
  User: {
    fullName(root) {
      console.log("fullName called!");
      console.log(root); // fullName을 호출하는 User
      /*
      fullName called!
      { id: '1', firstName: 'yj', lastName: 'lee' }
      fullName called!
      { id: '2', firstName: 'steve', lastName: 'jobs' }
      */
      const { firstName, lastName } = root;
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🐝 Running on ${url}`);
});
