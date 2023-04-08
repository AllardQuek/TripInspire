import styled from "styled-components";
import { Button, Grid, InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import NavBar from "../components/NavBar";
import { useEffect } from "react";

export default function TripDetails() {
  const [destination, setDestination] = useState("");
  const [numDays, setNumDays] = useState("");
  const [numNights, setNumNights] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const numRange = Array.from({ length: 10 }, (_, i) => i + 1);

  useEffect(() => {
    const pastDetails = window.localStorage.getItem("apiResults");

    if (typeof pastDetails !== "undefined") {
      console.log("Past details: ", pastDetails);
      try {
        setTripDetails(JSON.parse(pastDetails));
      } catch (err) {
        console.log("Error: ", err.message);
      }
    }
  }, []);

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleDaysChange = (event) => {
    setNumDays(event.target.value);
  };

  const handleNightsChange = (event) => {
    setNumNights(event.target.value);
  };

  // Upon clicking on the "explore" button, make an api call to get_tripadvisor_data
  const getTripAdvisorData = async () => {
    console.log("Explore button clicked");
    const response = await fetch(
      `/api/getTripAdvisorData?query=${destination}`
    );
    const data = await response.json();
    const apiResults = data.places.data;
    setTripDetails(apiResults);
    localStorage.setItem("apiResults", JSON.stringify(apiResults));

    console.log(data);
    console.log(tripDetails);
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
              onClick={getTripAdvisorData}
            >
              Explore Now
            </Button>
          </Grid>
        </Grid>

        {tripDetails && (
          <div className="recommendations">
            <h1 className="recommendations-header">Details</h1>

            <ul className="places-list" key="places-list">
              {tripDetails.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
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
