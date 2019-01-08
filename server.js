const express = require('express')
const expressGraphQL = require('express-graphql')
const schema = require('./schema/schema')

const app = express()

//Any incoming request looking for graphql route
app.use('/graphql', expressGraphQL({
  schema, //pass this schema to middleware
  graphiql: true
}))

app.listen(4000, () => {
  console.log('Listening at port: 4000')
})