import React from "react";
import Link from "next/link";

const navLinks = [
  { name: "Home", 
   path: "/" 
  },
  {
    name: "Questionnaire",
    path: "/Questionnaire",
  },
  {
    name: "Suggest A Trip",
    path: "/TripDetails",
  }
];

export default function Header() {
  return (
    <header>
      <div className="brand">
        <h3>TripInspire</h3>
      </div>
      <nav>
        {navLinks.map((link, index) => {
          return (
            <ul>
              <Link href={link.path}>
                <li key={index}>{link.name}</li>
              </Link>
            </ul>
          );
        })}
      </nav>
    </header>
  );
}