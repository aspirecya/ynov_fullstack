const express = require('express');
const config = require('../configs/server.config');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRouter = require('../routes');
const schema = require('../apollo/schemas');
const resolvers = require('../apollo/resolvers');

// start express
const app = express();

// graphql configs and setup
const { ApolloServer, gql } = require('apollo-server-express');

const graphQlServer = new ApolloServer({
    typeDefs : schema,
    resolvers
});

graphQlServer.applyMiddleware({ app, path: "/graphql" });

// cors
app.use(cors());

// middleware init
app.use(bodyParser.json());

// routes
app.use('/api/v1', apiRouter);

exports.start = () => {
    let port = config.port;

    app.listen(port, (err) => {
        if(err) {
            console.log(`Error: ${err}`);
            process.exit(-1);
        }
        console.log(`${config.name} - express running on port ${config.port}.`)
    })
};