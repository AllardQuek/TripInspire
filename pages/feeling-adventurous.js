import { Button, Grid, TextField } from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

export default function FeelingAdventurous() {
  const [destination, setDestination] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const theme = useTheme(getTheme());

  const COLUMNS = [
    { label: "Name", renderCell: (item) => item.name, resize: true },
    {
      label: "Address",
      renderCell: (item) => item.address_obj.address_string,
      resize: true,
    },
  ];

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
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

  return (
    <div>
      <NavBar />
      <Grid
        className="user-input"
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={2}>
          <TextField
            id="outlined-basic"
            label="Destination"
            variant="outlined"
            onChange={handleDestinationChange}
          />
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
      <Section>
        {tripDetails && (
          <div className="recommendations">
            <h1 className="recommendations-header">Explore More</h1>
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
  .recommendations {
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .recommendations-header {
    margin-top: 3rem;
    padding-bottom: 1rem;
  }
`;
