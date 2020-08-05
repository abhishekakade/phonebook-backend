const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide your password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fso2020:${password}@fso20-cluster1.hcjbq.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String,
});

// Model
const Person = mongoose.model("Person", personSchema);

// const person = new Person({
//   name: "Abhishek K",
//   number: "89-8754-2168",
//   id: "123",
// });

// Save contact using CLI parameters
const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
  id: Math.floor(Math.random() * 100),
});

console.log("Name:", process.argv[3]);
console.log("Number:", process.argv[4]);

// don't save contact if information undefined
if (person.name && person.number) {
  person.save().then((result) => {
    console.log("Contact saved!");
    mongoose.connection.close();
  });
}

// Model.find() mongoose API
Person.find({}).then((result) => {
  result.forEach((person) => {
    console.log(person);
  });
  mongoose.connection.close();
});
