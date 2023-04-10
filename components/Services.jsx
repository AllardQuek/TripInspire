import React from "react";
import Image from "next/image";
import styled from "styled-components";
import service1 from "../assets/service-itinerary.png";
import service2 from "../assets/service-recommendation.png";
import service3 from "../assets/service-route.png";
import service4 from "../assets/service-network.png";

export default function Services() {
  const data = [
    {
      icon: service1,
      title: "Itinerary Generation",
      subTitle: "Build a cohesive travel itinerary tailored just for you",
    },
    {
      icon: service2,
      title: "Personalised Recommendations",
      subTitle:
        "Share your travel preferences and get personalised recommendations.",
    },
    {
      icon: service3,
      title: "Explore New Journeys",
      subTitle:
        "Discover unique destinations and activities loved by other travellers.",
    },
    {
      icon: service4,
      title: "Feedback and Connect",
      subTitle: "Share reviews and connect with other travellers.",
    },
  ];
  return (
    <Section id="services">
      {data.map((service, index) => {
        return (
          <div className="service" key={index}>
            <Image className="icon" alt="{service.title}" src={service.icon} />
            <h3>{service.title}</h3>
            <p>{service.subTitle}</p>
          </div>
        );
      })}
    </Section>
  );
}

const Section = styled.section`
  padding: 5rem 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  .service {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    background-color: aliceblue;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 1rem;
    transition: 0.3s ease-in-out;
    &:hover {
      transform: translateX(0.4rem) translateY(-1rem);
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    }
    .icon {
      /* height: 50%; */
    }
  }
  @media screen and (min-width: 280px) and (max-width: 720px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
