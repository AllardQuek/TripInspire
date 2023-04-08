const fetch = require("node-fetch");

const options = {
  method: "GET",
  headers: { accept: "application/json" },
};

export default async function getTripAdvisorData(req, res) {
  const {
    query: { query },
  } = req;
  const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_KEY}&searchQuery=${query}&language=en`;
  console.log(url);

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      res.status(200).json({
        places: json,
      });
    })
    .catch((err) => console.error("error:" + err));
}
