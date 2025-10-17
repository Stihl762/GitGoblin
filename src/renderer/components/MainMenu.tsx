import React from "react";

const MainMenu: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: 'url("textures/stone-texture.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#222", // fallback if PNG fails to load
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default MainMenu;
