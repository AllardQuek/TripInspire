// useSWR allows the use of SWR inside function components
import useSWR from "swr";
import styled from "styled-components";
import { Button, Grid, InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

// Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TripDetails() {
  const [destination, setDestination] = useState("");
  const [numDays, setNumDays] = useState("");
  const [numNights, setNumNights] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const numRange = Array.from({ length: 10 }, (_, i) => i + 1);
  const theme = useTheme(getTheme());
  const budgetMapping = {
    1: "Free",
    2: "Cheap",
    3: "Moderate",
    4: "Expensive",
    5: "Exorbitant",
  };

  useEffect(() => {
    const pastDetails = window.localStorage.getItem("recommendations");

    if (typeof pastDetails !== "undefined") {
      console.log("Past details: ", pastDetails);
      try {
        setTripDetails(JSON.parse(pastDetails));
      } catch (err) {
        console.log("Error: ", err.message);
      }
    }
  }, []);

  // Fetch attractions data
  const { data, error } = useSWR("/api/staticdata", fetcher);
  let attractions = {};

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

  const COLUMNS = [
    { label: "Name", renderCell: (item) => item.name, resize: true },
    {
      label: "Address",
      renderCell: (item) => item.address,
      resize: true,
    },
    {
      label: "Budget",
      renderCell: (item) => budgetMapping[Number(item.budget)],
      resize: true,
    },
    {
      label: "Category",
      renderCell: (item) => item.category,
      resize: true,
    },
  ];

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleDaysChange = (event) => {
    setNumDays(event.target.value);
  };

  const handleNightsChange = (event) => {
    setNumNights(event.target.value);
  };

  const getRecommendations = () => {
    // Filter attraction results to those most suitable for user
    console.log(attractions);
    const cityAttractions = attractions[destination];
    setTripDetails(cityAttractions);

    localStorage.setItem("recommendations", JSON.stringify(cityAttractions));
    console.log("Local storage: ", localStorage.getItem("recommendations"));
    console.log("Request success!");
  };

  return (
    <div>
      <NavBar />
      <Section>
        <Grid
          className="trip-details"
          container
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="destination-label">Destination</InputLabel>
              <Select
                value={destination}
                label="destination"
                onChange={handleDestinationChange}
              >
                <MenuItem value="Singapore">Singapore</MenuItem>
                <MenuItem value="Munich">Munich</MenuItem>
                <MenuItem value="Vancouver">Vancouver</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <InputLabel id="num-days-label">Days</InputLabel>
              <Select value={numDays} label="Days" onChange={handleDaysChange}>
                {numRange.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth>
              <InputLabel id="num-nights-label">Nights</InputLabel>
              <Select
                value={numNights}
                label="Nights"
                onChange={handleNightsChange}
              >
                {numRange.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={getRecommendations}
            >
              Explore Now
            </Button>
          </Grid>
        </Grid>

        {tripDetails && (
          <div className="recommendations">
            <h1 className="recommendations-header">Your Itinerary</h1>
            <CompactTable
              theme={theme}
              columns={COLUMNS}
              data={{ nodes: tripDetails }}
            />
          </div>
        )}
      </Section>
    </div>
  );
}

const Section = styled.section`
  .trip-details {
    padding: 2rem 0;
  }

  .recommendations {
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .recommendations-header {
    padding: 1rem 0;
  }

  .places-list {
    list-style: none;
  }
`;
