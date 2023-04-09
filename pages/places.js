// useSWR allows the use of SWR inside function components
import useSWR from "swr";

import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
// import attraction_data from "../data/attractions.json";

// Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Places() {
  // Set up SWR to run the fetcher function when calling "/api/staticdata"
  // There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const theme = useTheme(getTheme());
  const numDays = 3;

  const { data, error } = useSWR("/api/staticdata", fetcher);
  let attractions = {};

  const COLUMNS = [
    { label: "Name", renderCell: (item) => item.name, resize: true },
    {
      label: "Address",
      renderCell: (item) => item.address,
      resize: true,
    },
    { label: "Budget", renderCell: (item) => item.budget, resize: true },
    {
      label: "Category",
      renderCell: (item) => item.category,
      resize: true,
    },
  ];

  // Convert data to  JSON format if it is not already
  try {
    attractions = JSON.parse(data);
  } catch (err) {
    console.log("Error: ", err.message);
  }
  console.log(attractions);
  const city_attractions = { nodes: attractions["Singapore"] };

  // Handle the error state
  if (error) return <div>Failed to load</div>;
  // Handle the loading state
  if (!data) return <div>Loading...</div>;
  // Handle the ready state and display the result contained in the data object mapped to the structure of the json file

  return (
    <div>
      <h1>Your Itinerary</h1>
      {attractions && (
        <div>
          {/* <ul>
            {attractions.Singapore.map((attraction) => (
              <li key={attraction.id}>
                {attraction.name}
                <ul>
                  <li>{attraction.address}</li>
                  <li>Budget: {attraction.budget}</li>
                  <li>Pace: {attraction.pace}</li>
                  <li>Accessibility: {attraction.accessibility}</li>
                </ul>
              </li>
            ))}
          </ul> */}
          <CompactTable
            theme={theme}
            columns={COLUMNS}
            data={city_attractions}
          />
        </div>
      )}
    </div>
  );
}
