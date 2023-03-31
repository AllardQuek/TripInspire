import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  TextField,
  MenuItem,
  Select,
  FormGroup,
  Checkbox,
  Button,
  Slider
} from "@mui/material";
import { Grid } from "@mui/material";
import { signOut } from "next-auth/react";

const Form = ({ name }) => {
  const initialValues = {
    country: "Canada",
    pace: "",
    transport: "",
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const [formValues, setFormValues] = useState(initialValues);
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container alignItems="center" justify="center" direction="column">
          <h1>Tell me more about your ideal trip, {name}.</h1>

          <Grid item>
            <FormControl>
              <FormLabel>Country</FormLabel>
              <Select
                name="country"
                value={formValues.country}
                onChange={handleInputChange}
              >
                <MenuItem key="canada" value="Canada">
                  Canada
                </MenuItem>
                <MenuItem key="japan" value="Japan">
                  Japan
                </MenuItem>
                <MenuItem key="germany " value="Germany">
                  Germany
                </MenuItem>
                <MenuItem key="switzerland " value="Switzerland">
                  Switzerland
                </MenuItem>
                <MenuItem key="australia " value="Australia">
                  Australia
                </MenuItem>
                <MenuItem key="united_states " value="United States">
                  United States
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl>
              <FormLabel>How important is each of the following to you on a trip?</FormLabel>
              <FormLabel>Food</FormLabel>
              <Slider
                aria-label="food"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                onChange={handleInputChange}
              />
              <FormLabel>Adventure</FormLabel>
              <Slider
                aria-label="adventure"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                onChange={handleInputChange}
              />
              <FormLabel>Nature</FormLabel>
              <Slider
                aria-label="nature"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                onChange={handleInputChange}
              />
              <FormLabel>Culture</FormLabel>
              <Slider
                aria-label="culture"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                onChange={handleInputChange}
              />
              <FormLabel>City</FormLabel>
              <Slider
                aria-label="city"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                onChange={handleInputChange}
              />
              <FormLabel>Shopping</FormLabel>
              <Slider
                aria-label="shopping"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                onChange={handleInputChange}
              />
              <FormLabel>Entertainment</FormLabel>
              <Slider
                aria-label="entertainment"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl>
              <FormLabel>What is your budget for the trip?</FormLabel>
              <Slider
                aria-label="budget"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={10}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl>
              <FormLabel>What is your preferred pace of trip?</FormLabel>
              <RadioGroup
                name="pace"
                value={formValues.pace}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  key="packed"
                  value="packed"
                  control={<Radio size="small" />}
                  label="Packed (>= 5 attractions a day)"
                />
                <FormControlLabel
                  key="comfortable"
                  value="comfortable"
                  control={<Radio size="small" />}
                  label="Comfortable (3-4 attractions a day)"
                />
                <FormControlLabel
                  key="chill"
                  value="chill"
                  control={<Radio size="small" />}
                  label="Chill (1-2 attractions a day)"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl>
              <FormLabel>How much local food do you want to eat?</FormLabel>
              <Slider
                aria-label="food"
                defaultValue={5}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={0}
                max={10}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item>
            <FormLabel>What are your preferred modes of transport?</FormLabel>
            <FormGroup
              value={formValues.pace}
              onChange={handleInputChange}
            >
              <FormControlLabel
                control={<Checkbox name="transport" defaultChecked />}
                label="Walking"
              />
              <FormControlLabel
                control={<Checkbox name="transport" />}
                label="Driving"
              />
              <FormControlLabel
                control={<Checkbox name="transport" />}
                label="Public transport"
              />
              <FormControlLabel
                control={<Checkbox name="transport" />}
                label="Ride-hailing"
              />
            </FormGroup>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="success"
              type="submit"
              style={{
                margin: "5px",
              }}
            >
              Submit
            </Button>
          </Grid>
          <Button variant="contained" onClick={() => signOut()}>
            Sign Out
          </Button>
        </Grid>
      </form>
    </>
  );
};
export default Form;
