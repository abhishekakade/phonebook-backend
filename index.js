const express = require("express");
const { request, response } = require("express");
const app = express();

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
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  response.json(person);
});

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "Content-Type": "application/json" });
//   response.end(JSON.stringify(notes));
// });

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
