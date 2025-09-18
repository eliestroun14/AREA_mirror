import React from "react";
import Card from "../components/card";
import sampleImage from "../assets/react.svg";

export default function Home() {
  const handleClick = () => alert("Card clicked !");

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "1.5rem",
      justifyContent: "center",
      padding: "2rem",
      marginTop: "60px"
    }}>
      <Card
        image={sampleImage}
        title="Manech"
        description="Dans le royaume de Cléunay, le roi Manech règne avec sagesse et courage. Mais son territoire est menacé : les gobelins Pablo et Timéo conspirent pour envahir ses terres et semer le chaos."
        buttonText="Voir plus"
        onButtonClick={handleClick}
      />
      <Card
        image={sampleImage}
        title="Roi"
        description="Dans le royaume de Cléunay, le roi Manech règne avec sagesse et courage. Mais son territoire est menacé : les gobelins Pablo et Timéo conspirent pour envahir ses terres et semer le chaos."
        buttonText="Voir plus"
        onButtonClick={handleClick}
      />
      <Card
        image={sampleImage}
        title="de Cleunay"
        description="Dans le royaume de Cléunay, le roi Manech règne avec sagesse et courage. Mais son territoire est menacé : les gobelins Pablo et Timéo conspirent pour envahir ses terres et semer le chaos."
        buttonText="Voir plus"
        onButtonClick={handleClick}
      />
    </div>
  );
}
