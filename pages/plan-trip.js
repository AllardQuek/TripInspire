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
import { usePagination } from "@table-library/react-table-library/pagination";
import { downloadAsCsv } from "@/utils/download_csv";
import { supabase } from "../utils/supabase";

// Write a fetcher function to wrap the native fetch function and return the result of a call to url in json format
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TripDetails() {
  const [destination, setDestination] = useState("");
  const [numDays, setNumDays] = useState(0);
  const [numNights, setNumNights] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const [uuid, setUuid] = useState("");
  const [budget, setBudget] = useState(0);
  const numRange = Array.from({ length: 10 }, (_, i) => i + 1);
  const theme = useTheme(getTheme());
  const budgetMapping = {
    1: "Free",
    2: "Cheap",
    3: "Moderate",
    4: "Expensive",
    5: "Exorbitant",
  };
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
    {
      label: "Rating",
      renderCell: (item) => item.rating,
      resize: true,
    },
  ];

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

  const pagination = usePagination(tripDetails, {
    state: {
      page: 0,
      size: Math.ceil(tripDetails.length / numDays),
    },
    onChange: onPaginationChange,
  });

  function onPaginationChange(action, state) {
    console.log(action, state);
  }

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

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleDaysChange = (event) => {
    setNumDays(event.target.value);
  };

  const handleNightsChange = (event) => {
    setNumNights(event.target.value);
  };

  const queryUserId = async () => {
    const user = supabase.auth.getUser();

    if (!user) {
      console.log("No active user!");
      return;
    }

    let uuid = "";

    user.then((value) => {
      uuid = value.data.user.id;
      setUuid(uuid);
    });
  };

  const queryUserBudget = async () => {
    // Query user's preferred budget from supabase
    console.log("UUID: ", uuid);
    const { data, error } = await supabase
      .from("profiles")
      .select("budget_level")
      .eq("id", uuid);

    return data;
  };

  const getRecommendations = () => {
    console.log(attractions);
    const cityAttractions = attractions[destination];

    // Sort attractions by budget
    cityAttractions.sort((a, b) => a.budget - b.budget);

    queryUserId();
    const budget_res = queryUserBudget();
    console.log("Budget Data: ", budget_res);

    budget_res.then((value) => {
      // Check length of value
      if (value.length === 0) {
        console.log("No budget data found!");
        return;
      }
      const budget_level = value[0].budget_level;
      setBudget(budget_level);
    });
    console.log("Budget level: ", budget);

    // Filter attraction results to those within the user's budget
    const filteredAttractions = cityAttractions.filter(
      (attraction) => attraction.budget <= budget
    );

    setTripDetails(filteredAttractions);

    localStorage.setItem(
      "recommendations",
      JSON.stringify(filteredAttractions)
    );
    console.log("Local storage: ", localStorage.getItem("recommendations"));
    console.log("Request success!");
  };

  const handleDownloadCsv = () => {
    const columns = [
      { accessor: (item) => item.name, name: "Name" },
      { accessor: (item) => item.address, name: "Address" },
      { accessor: (item) => item.category, name: "Budget" },
      { accessor: (item) => item.rating, name: "Category" },
      { accessor: (item) => item.rating, name: "Rating" },
    ];

    downloadAsCsv(columns, tripDetails, "my_itinerary");
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
            <FormControl fullWidth variant="filled">
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
            <FormControl fullWidth variant="filled">
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
            <h1 className="recommendations-header">My Itinerary</h1>
            <CompactTable
              theme={theme}
              columns={COLUMNS}
              data={{ nodes: tripDetails }}
              pagination={pagination}
            />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                No. of days: {pagination.state.getTotalPages(tripDetails)}
              </span>

              <span className="page-buttons">
                Day:
                {pagination.state.getPages(tripDetails).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    style={{
                      fontWeight:
                        pagination.state.page === index ? "bold" : "normal",
                    }}
                    onClick={() => pagination.fns.onSetPage(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </span>
            </div>
            <br />
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

  .csv-button {
    margin-top: 2rem;
  }

  .page-buttons {
    display: flex;
    gap: 0.5rem;
  }
`;
