import Button from "@mui/material/Button";
import Image from "next/image";
import React from "react";
import styled from "styled-components";
import homeImage from "../assets/hero.png";
import NavBar from "./NavBar";
import { supabase } from "../utils/supabase";
import { useState, useEffect } from "react";

export default function Hero() {
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    setSession(supabase.auth.getSession());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  if (session) {
    const user = supabase.auth.getUser();
    user.then((value) => {
      const google_username = value.data.user.user_metadata.name;
      const first_name = google_username.split(" ")[0];
      setUsername(first_name);
    });
    return (
      <div>
        <NavBar/ >
        <Section id="hero">
        <div className="background">
          <Image src={homeImage} alt="Background Image" />
        </div>
        <div className="content">
          <div className="title">
            <h1>TRIPINSPIRE</h1>
            <p>Welcome, {username}. We inspire the trip of your desires.</p>
          </div>
          <Button
            className="signOut-btn"
            variant="contained"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      </Section>
      </div>
    );
  } else {
    return (
      <Section id="hero">
        <div className="background">
          <Image src={homeImage} alt="Background Image" />
        </div>
        <div className="content">
          <div className="title">
            <h1>TRIPINSPIRE</h1>
            <p>We inspire the trip of your desires.</p>
          </div>
          <Button variant="contained" onClick={() => signInWithGoogle()}>
            Sign In
          </Button>
        </div>
      </Section>
    );
  }
}

const Section = styled.section`
  position: relative;
  margin-top: 2rem;
  width: 100%;
  height: 100%;

  .background {
    height: 100%;
    img {
      width: 100%;
      filter: brightness(60%);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .content {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 3;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .title {
      color: white;
      h1 {
        font-size: 3rem;
        letter-spacing: 0.2rem;
      }
      p {
        text-align: center;
        padding: 0 30vw;
        margin-top: 0.5rem;
        font-size: 1.2rem;
      }
    }
    .search {
      display: flex;
      background-color: #ffffffce;
      padding: 0.5rem;
      border-radius: 0.5rem;
      .container {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0 1.5rem;
        label {
          font-size: 1.1rem;
          color: #03045e;
        }
        input {
          background-color: transparent;
          border: none;
          text-align: center;
          color: black;
          &[type="date"] {
            padding-left: 3rem;
          }

          &::placeholder {
            color: black;
          }
          &:focus {
            outline: none;
          }
        }
      }
    }
  }
  @media screen and (min-width: 280px) and (max-width: 980px) {
    height: 25rem;
    .background {
      background-color: palegreen;
      img {
        height: 100%;
      }
    }
    .content {
      .title {
        h1 {
          font-size: 1rem;
        }
        p {
          font-size: 0.8rem;
          padding: 1vw;
        }
      }
      .search {
        flex-direction: column;
        padding: 0.8rem;
        gap: 0.8rem;
        /* padding: 0; */
        .container {
          padding: 0 0.8rem;
          input[type="date"] {
            padding-left: 1rem;
          }
        }
        button {
          padding: 1rem;
          font-size: 1rem;
        }
        /* display: none; */
      }
    }
  }
`;
