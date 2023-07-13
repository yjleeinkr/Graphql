# GraphQL

일명 gql, Structured Query Language(SQL)와 마찬가지로 **API를 위한 쿼리 언어**이다.<br>

- SQL : **DB에 저장된 데이터**를 효율적으로 가져오는게 목적, 따라서 백에서 작성하고 호출하는 경우가 대부분이다.
- GQL : **웹 클라이언트**가 데이터를 서버로부터 효율적으로 가져오는게 목적, 주로 클라이언트 시스템에서 작성하고 호출한다.
  기존의 Rest API의 단점을 보완한 하나의

> Graphql은 원래 하나의 컨셉이자 아이디어였고, 이 컨셉만 이해한다면 어떤 언어건간에 적용할 수 있다.

<br>

## 기존의 REST API 와 어떻게 다를까?

기존엔 백 쪽에 요청을 보낼 때 Rest API를 사용했다.

<br>

### REST API

1. **Over Fetching**: 내가 필요한 것보다 더 많은 데이터를 가져오는 경우
2. **Under Fetching**: 필요한 내용보다 적은 데이터를 가져와서 한 번의 요청이 아닌 여러 번의 요청을 거쳐서 가져와야하는 경우
3. **URL, HTTP 메소드를 통해** 어떤 데이터, 리소스(/user/:id/likes)를 어떻게 다룰 것인지(GET, POST, PUT, DELETE ...) 직관적으로 알 수 있다.

<br>

### Graphql

1. Over Fetching 해결: Graphql은 정확하게 필요한 정보만 요청하고 받게 해준다.
2. Under Fetching 해결: Graphql은 많은 정보를 단 한 번의 요청으로 가져올 수 있다.
3. 불러오는 데이터의 종류를 쿼리 조합을 통해 결정한다.

> REST API는 url, method의 조합으로 요청마다 url이 전부 다르기 때문에 다양한 endpoint 가 존재한다. 하지만, GraphQL은 하나의 endpoint만 존재한다.

> REST API : **각 endpoint마다** DB SQL 쿼리가 달라짐 <br> GRAPHQL API : **gql 스키마 타입마다** DB SQL 쿼리가 달라짐

<br>

## Graphql의 구조

<br>

### Query 와 Mutation

- `type Query` : 데이터를 읽는데 사용 (R) / graphql 서버에서 required type이다.
  - REST API 에서의 GET /api/v1/tweet/:id 와 같다.
- `type Mutation` : 데이터를 생성, 변경, 삭제할 때 사용 (CUD)
  - REST API 에서의 POST DELETE PUT /api/v1/tweet/:id 와 같다.

<br>

### Object Type과 field

```graphql
type User {
  id: ID!
  name: String!
  allTweets: [Tweet!]!
}
```

- Object Type : `User`
- Field : `id`, `allTweets`
- Scalar Type : `ID`, `String` 등
- 느낌표(!) : 필수값 (non-nullable) 의미 / !가 없으면, Nullable field 가 되어 null 허용함
- 대괄호([]) : 배열 의미

<br>

## Apollo Server로 시작

<br>

Apollo Server는 Express처럼 GraphQL API를 제공하는 서버를 개발할 수 있게 도와주는 패키지이다.

Apollo Server를 사용하려면 아래 두 개의 패키지를 설치해야한다.

```bash
yarn add apollo-server graphql
```

```javascript
// package.json에서 type module로 설정했을 경우
import { ApolloServer, gql } from "apollo-server";
// 또는
const { ApolloServer, gql } = require("apollo-server");
```

- `ApolloServer` : Graphql 서버 인스턴스를 만들어주는 생성자
- `gql` : Graphql 스키마 정의를 위해 사용되는 템플릿 리터럴 태그

```javascript
// Graphql 스키마 정의하는 부분
const typeDefs = gql`
  type Query{}
  type Mutation()
`;

// Graphql 스키마 통해 제공할 데이터 만드는 부분
const resolvers = {
  // Query resolver
  Query: {
    tweet(root, args) {
      // arguments 받아서 쿼리에 대한 결과 반환
    },
  },
  Mutation: {
    // arguments 받아서 쿼리에 대한 결과 반환 및 데이터 변경
  },
};

const server = new ApolloServer({ typeDef, resolvers }); // Apollo 서버 인스턴스 생성

server.listen().then(({ url }) => {
  console.log(`🐝 Running on ${url}`);
});
```

- `typeDefs` : `gql`을 사용해서 GraphQL 스키마 타입 정의
- `resolvers` : GraphQL 스키마를 통해 제공할 데이터를 정의하는 함수를 담은 객체
  <br>

  1. Query Resolvers
  2. Mutation Resolvers
  3. Type Resolvers

  - `arguments` <br>
    : Apollo 서버가 `resolvers` 함수 호출 시 resolver에게 어떤 arguments를 주는데, <br>
    첫번째 인자 `root` argument, 두번째 인자 클라이언트가 보낸 인자 (**실제 쿼리에 사용할 인자**)
    <br>
  - `Resolver arguments` <br>
    : 4개의 인자를 가짐 `parent(root || source)`, `args`, `contextValue`, `info` <br>
    `type resolver`를 호출한 root를 받아올 수 있다.
