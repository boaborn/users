const graphql = require('graphql')
const axios = require('axios'
)
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, // Takes in a root query and returns a graphql schema instance,
  GraphQLList // Build a list of something
} = graphql

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType), // A list of users
      resolve (parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data)
      }
    }
  })
})

// Handling specific type of data
// this object instruct GraphQL what user object looks like
const UserType = new GraphQLObjectType({
  name: 'User', // Always be a string, describe the type that we are definning, in this case, the type is User
  fields: () => ({ // Tells graph QL that all property that User type has
    // Format: key: what type of date
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { // Need resolve here because db returns companyId
      type: CompanyType,
      resolve (parentValue, args) {
        // Resove here by taking the parentvalue (companyId)
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data)
      }
    } // User defined type, works same as native type
  })
})

// Handling Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: { // Step 1: If you are looking for a user
      type: UserType, // Step 3: I will return a userType(which is user) back to you
      // Step 2: Then if you give me the id of a user,
      args: { id: { type: GraphQLString }},
      resolve (parentValue, args) { // Step 4, actually go to database and find the data
        // id will be present in args
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString }},
      resolve ( parentValue, args ) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(res => res.data)
      }
    }
  }
})

// Help function to find rootquery and avalible to public
module.exports = new GraphQLSchema({
  query: RootQuery
})
