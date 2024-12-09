const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const Port = 4001
const app = express();

// INI SCHEMA
const schema = buildSchema(`
    type User {
        id: ID
        name: String
        username: String
        email: String
        address: Address
    }
    type Address {
        street: String
        suite: String
        city: String
        zipcode: String
    }
    type Query {
        users: [User]
        userById(idCustomer: ID): User
    }
`)

// INI RESOLVER
const root = {
    users: async () => {
        try {
            const resultData = await fetch("https://jsonplaceholder.typicode.com/users")
            const result = await resultData.json()

            return result.map(el => (
                {
                    id: el.id.toString(),
                    name: el.name,
                    username: el.username,
                    email: el.email,
                    address: {
                        street: el.address.street,
                        suite: el.address.suite,
                        city: el.address.city,
                        zipcode: el.address.zipcode
                    }
                }
            ))
        } catch (error) {
            console.log(error, "==> INI ERRORNYA");
        }
    },
    userById: async ({idCustomer}) => {
        try {
            const resultData = await fetch(`https://jsonplaceholder.typicode.com/users/${idCustomer}`)
            const resultJson = await resultData.json()

            return {
                    id: resultJson.id.toString(),
                    name: resultJson.name,
                    username: resultJson.username,
                    email: resultJson.email,
                    address: {
                        street: resultJson.address.street,
                        suite: resultJson.address.suite,
                        city: resultJson.address.city,
                        zipcode: resultJson.address.zipcode
                    }
            }
            
        } catch (error) {
            console.log(error, "==> ini error by id");
        }
    },

}

app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))

// http://localhost:4001/users?query={users{name username}}
app.get("/users", async (req, res) => {
    try {
        await graphqlHTTP({
            schema,
            rootValue: root,
            graphiql: false // Menonaktifkan GraphiQL
        })(req, res); 

    } catch (error) {
        console.log(error);
    }
})

app.listen(Port, () => {
    console.log("Coba Graphql");
})
