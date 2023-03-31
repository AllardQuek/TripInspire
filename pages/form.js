import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Alert,
  Slider,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import { supabase } from "../utils/supabase";
import styled from "styled-components";
import { useRouter } from "next/router";

const Form = ({ username }) => {
  const [formValues, setFormValues] = useState();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const router = useRouter();

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    console.log(formValues);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: username,
          budget_level: event.target.budget_level.value,
          trip_pace: event.target.trip_pace.value,
          transport_mode: event.target.transport_mode.value,
          local_food: event.target.local_food.value,
          food_importance: event.target.food_importance.value,
          adventure_importance: event.target.adventure_importance.value,
          nature_importance: event.target.nature_importance.value,
          culture_importance: event.target.culture_importance.value,
          city_importance: event.target.city_importance.value,
          shopping_importance: event.target.shopping_importance.value,
          entertainment_importance: event.target.entertainment_importance.value,
        })
        .select();

      if (error) throw error;
      setUpdateSuccess(true);
      setFormValues();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <StyledForm>
      {updateSuccess && (
        <Alert severity="success" onClose={() => setUpdateSuccess(false)}>
          Successfully updated preferences!
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container alignItems="center" justify="center" direction="column">
          <h1 className="h1-header">What is your ideal trip, {username}?</h1>
          <Grid item className="question">
            <FormControl>
              <FormLabel>
                How much money are you willing to spend on a trip?
              </FormLabel>
              <RadioGroup
                name="budget_level"
                onChange={handleInputChange}
                defaultValue="3"
                row
              >
                <FormControlLabel
                  key="1"
                  value="1"
                  control={<Radio size="small" />}
                  label="Super Budget"
                />
                <FormControlLabel
                  key="2"
                  value="2"
                  control={<Radio size="small" />}
                  label="Not too much"
                />
                <FormControlLabel
                  key="3"
                  value="3"
                  control={<Radio size="small" />}
                  label="Average"
                />
                <FormControlLabel
                  key="4"
                  value="4"
                  control={<Radio size="small" />}
                  label="Slightly More"
                />
                <FormControlLabel
                  key="5"
                  value="5"
                  control={<Radio size="small" />}
                  label="Exorbitant"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item className="question">
            <FormControl>
              <FormLabel>What is your preferred pace of trip?</FormLabel>
              <RadioGroup
                name="trip_pace"
                onChange={handleInputChange}
                defaultValue="2"
                row
              >
                <FormControlLabel
                  key="1"
                  value="1"
                  control={<Radio size="small" />}
                  label="Chill (1-2) attractions per day"
                />
                <FormControlLabel
                  key="2"
                  value="2"
                  control={<Radio size="small" />}
                  label="Comfortable (3-4 attractions per day)"
                />
                <FormControlLabel
                  key="3"
                  value="3"
                  control={<Radio size="small" />}
                  label="Very packed (5+ attractions per day)"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item className="question">
            <FormControl>
              <FormLabel>What is your preferred mode of transport?</FormLabel>
              <RadioGroup
                name="transport_mode"
                onChange={handleInputChange}
                defaultValue="3"
                row
              >
                <FormControlLabel
                  key="1"
                  value="1"
                  control={<Radio size="small" />}
                  label="Walking"
                />
                <FormControlLabel
                  key="2"
                  value="2"
                  control={<Radio size="small" />}
                  label="Public transport"
                />
                <FormControlLabel
                  key="3"
                  value="3"
                  control={<Radio size="small" />}
                  label="Ride-sharing services"
                />
                <FormControlLabel
                  key="4"
                  value="4"
                  control={<Radio size="small" />}
                  label="Driving"
                />
                <FormControlLabel
                  key="0"
                  value="0"
                  control={<Radio size="small" />}
                  label="No preference"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item className="question">
            <Typography gutterBottom>
              How much local food are you willing/do you want to eat?
            </Typography>
            <Slider
              aria-label="local_food"
              name="local_food"
              onChange={handleInputChange}
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>
          <Grid item className="question">
            <Typography gutterBottom>
              How important is <strong>food</strong> for your trip?
            </Typography>
            <Slider
              aria-label="food_importance"
              name="food_importance"
              onChange={handleInputChange}
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>
          <Grid item className="question">
            <Typography gutterBottom>
              How important is <strong>adventure</strong> for your trip?
            </Typography>
            <Slider
              aria-label="adventure_importance"
              name="adventure_importance"
              onChange={handleInputChange}
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>
          <Grid item className="question">
            <Typography gutterBottom>
              How important is <strong>nature</strong> for your trip?
            </Typography>
            <Slider
              aria-label="nature_importance"
              name="nature_importance"
              onChange={handleInputChange}
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>
          <Grid item className="question">
            <Typography gutterBottom>
              How important is <strong>culture</strong> for your trip?
            </Typography>
            <Slider
              aria-label="culture_importance"
              name="culture_importance"
              onChange={handleInputChange}
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>
          <Grid item className="question">
            <Typography gutterBottom>
              How important is <strong>city</strong> for your trip?
            </Typography>
            <Slider
              aria-label="city_importance"
              name="city_importance"
              onChange={handleInputChange}
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>
          <Grid item className="question">
            <Typography gutterBottom>
              How important is <strong>shopping</strong> for your trip?
            </Typography>
            <Slider
              aria-label="shopping_importance"
              name="shopping_importance"
              onChange={handleInputChange}
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>
          <Grid item className="question">
            <Typography gutterBottom>
              How important is <strong>entertainment</strong> for your trip?
            </Typography>
            <Slider
              aria-label="entertainment_importance"
              name="entertainment_importance"
              onChange={handleInputChange}
              defaultValue={5}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Grid>

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
          <Button variant="contained" onClick={() => signOut()}>
            Sign Out
          </Button>
        </Grid>
      </form>
    </StyledForm>
  );
};

const StyledForm = styled.section`
  .h1-header {
    margin-bottom: 1rem;
  }

  .question {
    margin-bottom: 1rem;
  }
`;

export default Form;
