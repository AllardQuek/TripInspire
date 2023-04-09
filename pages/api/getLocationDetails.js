const fetch = require("node-fetch");

const options = {
  method: "GET",
  headers: { accept: "application/json" },
};

export default async function getLocationDetails(req, res) {
  const locationId = req.query.locationId;
  const url = `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details?key=${process.env.TRIPADVISOR_KEY}&language=en&currency=SGD`;
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
