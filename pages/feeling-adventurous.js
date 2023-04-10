import { Button, Grid, TextField } from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import NavBar from "@/components/NavBar";
import CircularProgressWithLabel from "@/components/CircularProgressWithLabel";
import { useEffect } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { downloadAsCsv } from "@/utils/download_csv";

export default function FeelingAdventurous() {
  const [destination, setDestination] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const theme = useTheme(getTheme());

  const resize = { resizerHighlight: "#dde2eb", resizerWidth: 25 };

  const COLUMNS = [
    { label: "Name", renderCell: (item) => item.name, resize: { resize } },
    {
      label: "Address",
      renderCell: (item) => item.address_obj.address_string,
      resize: { resize },
    },
    {
      label: "Category",
      renderCell: (item) => item.category.name,
      resize: { resize },
    },
    {
      label: "Rating",
      renderCell: (item) => item.rating,
      resize: { resize },
    },
    {
      label: "Ranking",
      renderCell: (item) => item.ranking_data.ranking_string,
      resize: { resize },
    },
  ];

  const handleDownloadCsv = () => {
    const columns = [
      { accessor: (item) => item.name, name: "Name" },
      { accessor: (item) => item.address, name: "Address" },
      { accessor: (item) => item.category, name: "Category" },
      { accessor: (item) => item.rating, name: "Rating" },
      { accessor: (item) => item.ranking_data.ranking_string, name: "Ranking" },
    ];

    downloadAsCsv(columns, tripDetails, "to_explore");
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const getTripAdvisorData = async () => {
    setLoading(true);
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
      const category = locationDetails.places.category?.name || "-";
      // console.log("Location details: ", locationDetails);

      // Filter for those above a threshold rating
      if (rating >= 4.0 && category !== "hotel") {
        console.log(
          "Location above threshold rating, adding to final results!"
        );
        finalResults.push(locationDetails.places);
      }

      const percentageCompleted = ((i + 1) / apiResults.length) * 100;
      setProgress(percentageCompleted);
      console.log("Progress: ", progress);
    }
    setTripDetails(finalResults);
    console.log("Trip details: ", tripDetails);

    localStorage.setItem("finalResults", JSON.stringify(finalResults));
    console.log("Local storage: ", localStorage.getItem("finalResults"));
    console.log("Request success!");
    setLoading(false);
    setProgress(0);
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
      <Section>
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <Grid item className="destination-input">
            <TextField
              className="glow-effect"
              id="outlined-basic"
              label="Destination"
              variant="outlined"
              onChange={handleDestinationChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            {!loading ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={getTripAdvisorData}
              >
                Explore Now
              </Button>
            ) : (
              <CircularProgressWithLabel value={progress} />
            )}
          </Grid>
        </Grid>
        {tripDetails && (
          <div className="recommendations">
            <h1 className="recommendations-header">Explore More</h1>
            <CompactTable
              theme={theme}
              columns={COLUMNS}
              data={{ nodes: tripDetails }}
            />
            <Button
              className="csv-button"
              variant="contained"
              size="small"
              color="success"
              onClick={handleDownloadCsv}
            >
              Download CSV
            </Button>
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

  .destination-input {
    width: 40%;
  }

  .csv-button {
    margin-top: 2rem;
  }
`;
