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
import NavBar from "../components/NavBar";
import Image from "next/image";
import adventureImage from "../assets/adventureImage.png";
import foodImage from "../assets/foodImage.png";
import natureImage from "../assets/Destination4.png";
import cultureImage from "../assets/Destination2.png";
import cityImage from "../assets/Destination1.png";
import shoppingImage from "../assets/shoppingImage.png";
import entertainmentImage from "../assets/entertainmentImage.png";

const Questionnaire = ({ username }) => {
  const [formValues, setFormValues] = useState();
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
    <div>
      <NavBar />
      <StyledForm>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            alignItems="center"
            justify="center"
            direction="column"
          >
            <h1 className="h1-header">Tell us your ideal trip.</h1>
            <Grid item className="question">
              <FormControl>
                <FormLabel>💰 What is your budget?</FormLabel>
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
                    label="Free"
                  />
                  <FormControlLabel
                    key="2"
                    value="2"
                    control={<Radio size="small" />}
                    label="Economy"
                  />
                  <FormControlLabel
                    key="3"
                    value="3"
                    control={<Radio size="small" />}
                    label="Moderate"
                  />
                  <FormControlLabel
                    key="4"
                    value="4"
                    control={<Radio size="small" />}
                    label="Expensive"
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
                <FormLabel>💨 What is your preferred pace of trip?</FormLabel>
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
                <FormLabel>
                  🛣 What is your preferred mode of transport?
                </FormLabel>
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
              <FormLabel>
                🍽 How much local food are you willing/do you want to eat?
              </FormLabel>
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
              <FormLabel>
                Tell us more about your priorities on a trip.
              </FormLabel>
              <div>
                <Image
                  style={{ width: "570px", height: "320px" }}
                  src={foodImage}
                  alt="Food Image"
                />
              </div>
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
              <Image
                style={{ width: "570px", height: "320px" }}
                src={adventureImage}
                alt="Adventure Image"
              />
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
              <Image src={natureImage} alt="Nature Image" />
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
              <Image src={cultureImage} alt="Culture Image" />
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
              <Image src={cityImage} alt="City Image" />
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
              <Image
                style={{ width: "570px", height: "380px" }}
                src={shoppingImage}
                alt="Shopping Image"
              />
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
              <Image
                style={{ width: "570px", height: "374px" }}
                src={entertainmentImage}
                alt="Entertainment Image"
              />
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
          </Grid>
        </form>
        {updateSuccess && (
          <Alert
            className="success-alert"
            severity="success"
            onClose={() => setUpdateSuccess(false)}
          >
            Successfully updated preferences!
          </Alert>
        )}
      </StyledForm>
    </div>
  );
};

const StyledForm = styled.section`
  .h1-header {
    margin: 2rem 0;
  }

  .question {
    margin-bottom: 1rem;
  }

  .success-alert {
    margin: 2rem 0;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

export default Questionnaire;
