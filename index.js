const express = require("express");
// const cors = require("cors");

const { db: destinations } = require("./DB")

const { getRandomId } = require("./HELPERS");

// express allows us to create a server application that can listen to http request
const server = express();   // this server is deaf -- not listening to jack

// tell the server to use express.json to parse json data => middleware needed to extract request's body for post and updates
server.use(express.json());


// sending just some text
server.get("/name", (req, res) => {
    res.send("Hello World")
});

// sending array with objects
// end point or route = method + path (/get/destinations)
// READ => GET
server.get("/destinations", (req, res) => {
    res.send(destinations);
})

// CREATE => POST
// taking body from request (NEED to have our server use express.json() above to parse the json) 
server.post("/destinations", (req, res) => {
    // console.log(req.body);
    // generate unique id 
    const _id = getRandomId();

    // filtering to get only required fields and remove unnecessary ones
    const { name, location, photo, description } = req.body; // no photo url will be sent by user but we will need to create a const and use splash api to get photo

    // inserting destinations using _id as key and adding _id as the var in the object with other filtered properties above
    destinations[_id] = { _id, name, location, photo, description }

    res.send({ status: "success" });     // sending status OK for the request so the client's app won't crash running forever...
})

// UPDATE => PUT
server.put("/destinations", (req, res) => {
    // extracting _id or parameter from the request
    const { _id } = req.query;

    // creating var for easy access to the object var
    const dest = destinations[_id];

    // checking if the put request has _id
    if (_id === undefined) {
        return res.status(400).send({ message: "?_id required" });
    }

    // checking if the _id provided in put request exists
    if (destinations[_id] === undefined) {
        return res.status(410).send({ message: "no destination with that _id to update" })
    }

    // filtering to get only required fields and remove unnecessary ones
    const { name, location, photo, description } = req.body;

    if (name !== undefined) {
        dest.name = name;
    }
    if (name !== undefined) {
        dest.location = location;
    }
    if (name !== undefined) {
        dest.photo = photo;
    }
    if (name !== undefined) {
        dest.description = description;
    }

    res.send({ status: "success" });
})

// DELETE 
server.delete("/destinations", (req, res) => {
    // assign param in the request as a _id var
    const { _id } = req.query;

    // creating var for easy access to the object var
    const dest = destinations[_id];

    // checking if the put request has _id
    if (_id === undefined) {
        return res.status(400).send({ message: "?_id required" });
    }

    // checking if the _id provided in put request exists with the object _id in the destinations
    if (dest === undefined) {
        return res.status(410).send({ message: "no destination with that _id to delete" })
    }

    // delete an object from destinations object
    delete destinations[_id];

    res.send({ status: "success" });
})


// making express server listen to port 3000
server.listen(3000, () => {
    console.log("server listening on port 3000");
});
