import Image from "next/image";
import styled from "styled-components";
import homeImage from "../assets/hero.png";
import { Button, Grid, InputLabel, MenuItem, FormControl } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import NavBar from "../components/NavBar";


export default function TripDetails() {
  const [destination, setDestination] = useState("");
  const [numDays, setNumDays] = useState("");
  const [numNights, setNumNights] = useState("");
  const numRange = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
    console.log(event.target.value);
  };

  const handleDaysChange = (event) => {
    setNumDays(event.target.value);
    console.log(event.target.value);
  };

  const handleNightsChange = (event) => {
    setNumNights(event.target.value);
    console.log(event.target.value);
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
            <Button variant="contained" color="secondary">
                Explore Now
            </Button>
            </Grid>
        </Grid>
        </Section>
    </div>
  );
}

const Section = styled.section`
  .trip-details {
    padding: 2rem 0;
  }
`;
