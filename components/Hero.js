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

  if (session) {
    const user = supabase.auth.getUser();
    if (user) {
      user.then((value) => {
        const google_username = value.data.user.user_metadata.name;
        const first_name = google_username.split(" ")[0];
        setUsername(first_name);
      });
      console.log("Username: ", username);
    }
  } else {
    console.log("No active session");
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <div>
      <Image
        className="background"
        alt="Background Image"
        src={homeImage}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          filter: "brightness(60%)",
          zIndex: "-1",
        }}
      />

      {session ? <NavBar /> : null}

      <Section id="hero">
        <div className="content">
          <div className="title">
            <h1>TRIPINSPIRE</h1>
            {session ? (
              <p>Welcome, {username}. We inspire the trip of your desires.</p>
            ) : (
              <p>We inspire the trip of your desires.</p>
            )}
          </div>
          {!session ? (
            <Button variant="contained" onClick={() => signInWithGoogle()}>
              Sign In
            </Button>
          ) : (
            <Button variant="contained" onClick={() => signOut()}>
              Sign Out
            </Button>
          )}
        </div>
      </Section>
    </div>
  );
}

const Section = styled.section`
  .content {
    margin-top: 2rem;
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
    }
  }
`;
