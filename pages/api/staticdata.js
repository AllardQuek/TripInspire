import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  // Get the type of data from the request
  const type = req.query.data;
  console.log("DATA TYPE IS: ", req.data);

  // Find the absolute path of the json directory
  const jsonDirectory = path.join(process.cwd(), "data");
  // Read the json data file data.json
  const fileContents = await fs.readFile(
    jsonDirectory + `/${type}.json`,
    "utf8"
  );
  // Return the content of the data file in json format
  res.status(200).json(fileContents);
}
