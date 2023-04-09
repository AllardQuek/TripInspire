import styled from "styled-components";
import { Button, Grid, InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

export default function TripDetails() {
  const [destination, setDestination] = useState("");
  const [numDays, setNumDays] = useState("");
  const [numNights, setNumNights] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const numRange = Array.from({ length: 10 }, (_, i) => i + 1);
  const theme = useTheme(getTheme());

  const COLUMNS = [
    { label: "Name", renderCell: (item) => item.name, resize: true },
    {
      label: "Address",
      renderCell: (item) => item.address_obj.address_string,
      resize: true,
    },
  ];

  useEffect(() => {
    const pastDetails = window.localStorage.getItem("finalResults");

    if (typeof pastDetails !== "undefined") {
      console.log("Past details: ", pastDetails);
      try {
        setTripDetails(JSON.parse(pastDetails));
      } catch (err) {
        console.log("Error: ", err.message);
      }
    }
  }, []);

  const city_attractions = { nodes: tripDetails };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleDaysChange = (event) => {
    setNumDays(event.target.value);
  };

  const handleNightsChange = (event) => {
    setNumNights(event.target.value);
  };

  const getTripAdvisorData = async () => {
    console.log("Explore button clicked");
    const attractionsResponse = await fetch(
      `/api/getTripAdvisorData?query=${destination}`
    );
    const data = await attractionsResponse.json();
    const apiResults = data.places.data;
    console.log("API results: ", apiResults);

    const finalResults = [];
    // Query the API for each location details
    for (let i = 0; i < apiResults.length; i++) {
      const locationId = apiResults[i].location_id;
      const locationDetailsResponse = await fetch(
        `/api/getLocationDetails?locationId=${locationId}`
      );
      const locationDetails = await locationDetailsResponse.json();
      const rating = Number(locationDetails.places.rating);
      const category = locationDetails.places.category.name;

      // console.log("Location details: ", locationDetails);
      console.log(rating, typeof rating);
      console.log(category);

      // Filter for those above a threshold rating
      if (rating >= 4.0 && category === "attraction") {
        console.log(
          "Location above threshold rating, adding to final results!"
        );
        finalResults.push(locationDetails.places);
      }
    }

    setTripDetails(finalResults);
    console.log("Trip details: ", tripDetails);

    localStorage.setItem("finalResults", JSON.stringify(finalResults));
    console.log("Local storage: ", localStorage.getItem("finalResults"));
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
            <h1 className="recommendations-header">Your Itinerary</h1>
            <CompactTable
              theme={theme}
              columns={COLUMNS}
              data={city_attractions}
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
