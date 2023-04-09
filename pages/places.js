// useSWR allows the use of SWR inside function components
import useSWR from "swr";

import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

const nodes = [
  {
    id: "0",
    name: "Shopping List",
    deadline: new Date(2020, 1, 15),
    type: "TASK",
    isComplete: true,
    nodes: 3,
  },
  {
    id: "1",
    name: "Grocery List",
    deadline: new Date(2020, 1, 15),
    type: "TASK",
    isComplete: true,
    nodes: 3,
  },
];

// Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Places() {
  // Set up SWR to run the fetcher function when calling "/api/staticdata"
  // There are 3 possible states: (1) loading when data is null (2) ready when the data is returned (3) error when there was an error fetching the data
  const nodes_data = { nodes };
  const theme = useTheme(getTheme());

  const { data, error } = useSWR("/api/staticdata", fetcher);
  let attractions = {};

  const COLUMNS = [
    { label: "Task", renderCell: (item) => item.name },
    {
      label: "Deadline",
      renderCell: (item) =>
        item.deadline.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    },
    { label: "Type", renderCell: (item) => item.type },
    {
      label: "Complete",
      renderCell: (item) => item.isComplete.toString(),
    },
    { label: "Tasks", renderCell: (item) => item.nodes },
  ];

  // Convert data to  JSON format if it is not already
  try {
    attractions = JSON.parse(data);
  } catch (err) {
    console.log("Error: ", err.message);
  }

  // Handle the error state
  if (error) return <div>Failed to load</div>;
  // Handle the loading state
  if (!data) return <div>Loading...</div>;
  // Handle the ready state and display the result contained in the data object mapped to the structure of the json file
  return (
    <div>
      <h1>Attractions</h1>
      {attractions && (
        <ul>
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
        </ul>
      )}
      <CompactTable theme={theme} columns={COLUMNS} data={nodes_data} />;
    </div>
  );
}
