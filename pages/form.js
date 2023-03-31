import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  Alert,
} from "@mui/material";
import { Grid } from "@mui/material";
import { supabase } from "../utils/supabase";
import styled from "styled-components";
import { useRouter } from "next/router";

const Form = ({ username }) => {
  const [formValues, setFormValues] = useState();
  const [uuid, setUuid] = useState();
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: username,
          budget_level: formValues.budget_level,
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
          <Grid item>
            <FormControl>
              <FormLabel>
                How much money are you willing to spend on a trip?
              </FormLabel>
              <RadioGroup name="budget_level" onChange={handleInputChange} row>
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
    </StyledForm>
  );
};

const StyledForm = styled.section`
  .h1-header {
    margin-bottom: 1rem;
  }
`;

export default Form;
