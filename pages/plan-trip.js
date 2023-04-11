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
import attractions from "../data/attractions.json";
import food_places from "../data/food_places.json";
import accommodations from "../data/accommodations.json";

export default function TripDetails() {
  const [destination, setDestination] = useState("");
  const [numDays, setNumDays] = useState("");
  const [numNights, setNumNights] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const [foodResults, setFoodResults] = useState("");
  const [accommsResults, setAccommsResults] = useState("");
  const [uuid, setUuid] = useState("");
  const [budget, setBudget] = useState(0);
  const [pace, setPace] = useState(0);
  const [numPerDay, setNumPerDay] = useState(0);

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
      label: "Accessibility",
      renderCell: (item) => Number(item.accessibility),
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

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

  useEffect(() => {
    // Local storage returns a string
    // const pastDetails = window.localStorage.getItem("recommendations");
    // const savedNumDays = window.localStorage.getItem("numDays");
    // setNumDays(Number(savedNumDays));
    // console.log("past dets", pastDetails, typeof pastDetails);
    // if (
    //   pastDetails === "undefined" ||
    //   pastDetails.length === 0 ||
    //   pastDetails === "[]"
    // ) {
    //   console.log("No past details found.");
    //   return;
    // }
    // console.log("Past details: ", pastDetails);
    // try {
    //   setTripDetails(JSON.parse(pastDetails));
    // } catch (err) {
    //   console.log("Error: ", err.message);
    // }
  }, []);

  const pagination = usePagination(tripDetails, {
    state: {
      page: 0,
      size: numPerDay,
      // size: Math.ceil(tripDetails.length / numDays),
    },
    onChange: onPaginationChange,
  });

  const foodPagination = usePagination(foodResults, {
    state: {
      page: 0,
      size: 3,
    },
    onChange: onPaginationChange,
  });

  function onPaginationChange(action, state) {
    console.log(action, state);
  }

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleDaysChange = (event) => {
    const newNumDays = event.target.value;
    localStorage.setItem("numDays", newNumDays);
    setNumDays(newNumDays);
  };

  const handleNightsChange = (event) => {
    setNumNights(event.target.value);
  };

  const getUserId = () => {
    const user = supabase.auth.getUser();

    if (!user) {
      console.log("No active user!");
      return;
    }

    user.then((value) => {
      setUuid(value.data.user.id);
    });
  };

  const queryUserDetails = async (field) => {
    // Query user's preferred budget from supabase
    console.log("UUID: ", uuid);
    const { data, error } = await supabase
      .from("profiles")
      .select(field)
      .eq("id", uuid);

    if (!data || data.length === 0) {
      console.log("No data found!");
      return;
    }

    if (field === "budget_level") {
      setBudget(data[0].budget_level);
    } else if (field === "trip_pace") {
      setPace(data[0].trip_pace);
    }
  };

  const getRecommendations = () => {
    const cityAttractions = attractions[destination];
    const cityFoodPlaces = food_places[destination];
    const cityAccommodations = accommodations[destination];

    // Sort locations by budget
    cityAttractions.sort((a, b) => a.budget - b.budget);
    cityFoodPlaces.sort((a, b) => a.budget - b.budget);
    cityAccommodations.sort((a, b) => a.budget - b.budget);

    getUserId();
    queryUserDetails("budget_level");
    queryUserDetails("trip_pace");
    console.log("Budget level: ", budget);
    console.log("Trip pace : ", pace);

    // Filter for places within the user's budget
    const filteredAttractions = cityAttractions.filter(
      (attraction) => attraction.budget <= budget
    );

    const filteredFood = cityFoodPlaces.filter(
      (foodPlace) => foodPlace.budget <= budget
    );

    const filteredAccommodations = cityAccommodations.filter(
      (accommodation) => accommodation.budget <= budget
    );

    const numAttractionsPerDay =
      pace === 1
        ? getRandomIntInclusive(1, 2)
        : pace === 2
        ? getRandomIntInclusive(3, 4)
        : pace === 3
        ? getRandomIntInclusive(5, 6)
        : 0;
    const totalNumAttractions = numAttractionsPerDay * numDays;

    // Filter to get totalNumAttractions from filtered attractions
    filteredAttractions.length = totalNumAttractions;

    console.log(
      "FILTERED ATTRACTIONS: ",
      filteredAttractions.length,
      typeof filteredAttractions
    );

    setNumPerDay(numAttractionsPerDay);
    const finalAttractions = filteredAttractions;
    setTripDetails(finalAttractions);
    setFoodResults(filteredFood);
    setAccommsResults(filteredAccommodations);

    if (finalAttractions.length > 0) {
      localStorage.setItem("recommendations", JSON.stringify(finalAttractions));
    } else {
      console.log("No recommendations saved!");
    }

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
        {foodResults && (
          <div className="recommendations">
            <h1 className="recommendations-header">Where To Eat</h1>
            <CompactTable
              theme={theme}
              columns={COLUMNS}
              data={{ nodes: foodResults }}
              pagination={foodPagination}
            />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                No. of days: {foodPagination.state.getTotalPages(foodResults)}
              </span>

              <span className="page-buttons">
                Day:
                {pagination.state.getPages(foodResults).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    style={{
                      fontWeight:
                        foodPagination.state.page === index ? "bold" : "normal",
                    }}
                    onClick={() => foodPagination.fns.onSetPage(index)}
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
        {accommsResults && (
          <div className="recommendations">
            <h1 className="recommendations-header">Where To Stay</h1>
            <CompactTable
              theme={theme}
              columns={COLUMNS}
              data={{ nodes: accommsResults }}
            />
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
    padding: 3rem 2rem 0 0;
  }

  .recommendations {
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 2rem 0;
  }

  .recommendations-header {
    padding: 1rem 0;
  }

  .places-list {
    list-style: none;
  }

  .csv-button {
    margin-top: 0.5rem;
  }

  .page-buttons {
    display: flex;
    gap: 0.5rem;
  }
`;
