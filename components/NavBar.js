import Link from "next/link";
import styled from "styled-components";
import { useState } from "react";
import NavItem from "./NavItem";

const navLinks = [
  { name: "Home", path: "/" },
  {
    name: "Questionnaire",
    path: "/questionnaire",
  },
  {
    name: "Suggest A Trip",
    path: "/trip-details",
  },
];

export default function NavBar() {
  const [navActive, setNavActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  return (
    <Nav>
      <header>
        <nav className={`nav`}>
          <Link href={"/"}>
            <h1 className="logo">TripInspire</h1>
          </Link>
          <div
            onClick={() => setNavActive(!navActive)}
            className={`nav__menu-bar`}
          ></div>
          <div className={`${navActive ? "active" : ""} nav__menu-list`}>
            {navLinks.map((navLink, idx) => (
              <div
                onClick={() => {
                  setActiveIdx(idx);
                  setNavActive(false);
                }}
                key={navLink.name}
              >
                <NavItem
                  active={activeIdx === idx}
                  href={navLink.path}
                  text={navLink.name}
                />
              </div>
            ))}
          </div>
        </nav>
      </header>
    </Nav>
  );
}

const Nav = styled.nav`
  * {
    margin: 0;
    padding: 0;
    outline: none;
    box-sizing: border-box;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  header {
    position: sticky;
    z-index: 30;
    top: 0;
    background-color: lightgrey;
    border-radius: 1rem;
    opacity: 0.8;
  }
  nav {
    display: flex;
    padding: 16px;
    justify-content: space-between;
    align-items: center;
    /* background-color: lightgrey; */
  }
  .nav__menu-bar {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    cursor: pointer;
  }
  .nav__menu-bar div {
    width: 40px;
    height: 4px;
    /* background-color: black; */
    border-radius: 2px;
  }
  .nav__menu-list {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 60px;
    width: 288px;
    row-gap: 24px;
    right: -288px;
    padding: 24px 16px;
    transition: all 0.2s;
    min-height: calc(100vh - 60px);
    /* background-color: #f1f1f1; */
  }
  .nav__menu-list.active {
    right: 0;
  }
  .nav__link {
    font-size: 18px;
    position: relative;
    transition: all 0.2s;
  }

  .nav__link:hover {
    font-weight: bold;
  }

  .center {
    min-height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media screen and (min-width: 768px) {
    .nav__menu-bar {
      display: none;
    }
    .nav__menu-list {
      position: unset;
      flex-direction: row;
      min-height: fit-content;
      width: fit-content;
      column-gap: 24px;
      align-items: center;
    }
    .nav__link::before {
      content: "";
      position: absolute;
      width: 0%;
      height: 6px;
      bottom: -16px;
      left: 0;
      background-color: black;
      transition: all 0.2s;
    }

    .nav__link:hover:before {
      width: 100%;
    }
  }
`;
