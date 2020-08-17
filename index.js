require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const Person = require("./models/person");

let persons = require("./persons");
const password = process.argv[2];
// const url = `mongodb+srv://fso2020:${password}@fso20-cluster1.hcjbq.mongodb.net/phonebook?retryWrites=true&w=majority`;
const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
});

/* 
The frontend assumes that every object has a unique `id` in the `id` field.
We also don't want to return the mongo versioning field `__v` to the frontend.
One way to format the objects returned by Mongoose is to modify the `toJSON` method of the schema.
*/

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

/* 
Even though the `_id` property of Mongoose objects looks like a string, it is in fact an object. 
The `toJSON` method we defined transforms it into a string just to be safe. 
If we didn't make this change, it would cause more harm for us in the future once we start writing tests.
*/

// Model
// const Person = mongoose.model("Person", personSchema);

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

// custom morgan token function to get request.body details
morgan.token("request-details", function (req) {
  return JSON.stringify(req.body);
});

// morgan logs date + time along with request method, URL, status code,
// response time in ms and request.body details to the console
app.use(
  morgan(
    ":date :remote-addr\n:method :url :status :response-time ms :request-details"
  )
);

app.get("/", (request, response) => {
  response.send("<h1>Hello from Node + Express!</h1>");
});

app.get("/info", (request, response) => {
  response.send(
    `<h1>Phonebook Info</h1><p>Phonebook has contact information of ${
      persons.length
    } people</p>${new Date()}<p></p>`
  );
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// new contact
app.post("/api/persons", (request, response) => {
  const body = request.body;
  // console.log("request body", person);

  // id for new contact greater than the max id for any contact in list + 1
  // const maxId = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  // person.id = String(maxId);

  // if (body.content === undefined) {
  if (!body.name.trim() || !body.number.trim()) {
    return response.status(400).json({
      error: "Contact details cannot be empty!",
    });
  } else if (
    persons.find((p) => {
      if (p.name.toLowerCase().trim() === body.name.toLowerCase().trim()) {
        return response.status(400).json({
          error: "Contact already exists! Contact name must be unique.",
        });
      } else if (
        p.number.toLowerCase().trim() === body.number.toLowerCase().trim()
      ) {
        return response.status(400).json({
          error: "Number already exists!",
        });
      }
    })
  ) {
    console.log(body.name);
    return null;
  } else {
    /*
    // Previous code not needed but kept for reference 
    const idGen = Math.floor(Math.random() * 654867);
    persons = persons.concat(person);
    // since I wanted to trim strings before saving 
    persons = persons.concat({
      name: body.name.trim(),
      number: body.number.trim(),
      id: String(idGen),
    });

    console.log(persons);
    response.json(body);
    */

    const person = new Person({
      name: body.name.trim(),
      number: body.number.trim(),
      date: new Date(),
    });

    person.save().then((savedContact) => {
      response.json(savedContact);
    });
  }
});

app.get("/api/persons/:id", (request, response) => {
  // const id = request.params.id;
  // const person = persons.find((person) => person.id === id);
  // response.json(person);

  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  // response.json(persons);
  // response.status(204).json(persons).end();
  response.status(204).json(persons);
});

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

/* 

let persons = [
  {
    name: "Sebastian Markbage",
    number: "28-48-465434",
    id: "1",
  },
  {
    name: "Rachel Nabors",
    number: "18-88-962484",
    id: "2",
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: "3",
  },
  {
    name: "Luna Ruan",
    number: "19-52-875028",
    id: "4",
  },
  {
    name: "Dominic Gannaway",
    number: "12-24-366446",
    id: "5",
  },
  {
    name: "Brian Vaughn",
    number: "39-23-6423122",
    id: "6",
  },
  {
    name: "Andrew Clark",
    number: "49-73-9780122",
    id: "7",
  },
];

*/
