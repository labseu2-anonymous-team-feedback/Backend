require('dotenv').config();
const { app, graphqlPath } = require('./api/server');

const port = process.env.PORT || 4000;

app.listen({ port }, () => console.log(`🚀 Server ready at http://localhost:${port}${graphqlPath}`));
