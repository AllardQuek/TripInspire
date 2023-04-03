const fetch = require("node-fetch");

const test = require("dotenv").config({ path: ".env.local" });
const searchQuery = "singapore";

const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_KEY}&searchQuery=${searchQuery}&language=en`;
const options = { method: "GET", headers: { accept: "application/json" } };
console.log(url);

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
