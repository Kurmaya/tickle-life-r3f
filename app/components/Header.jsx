import React from "react";

export default function Header({ active, onToggle }) {
  return (
    <>
      
      {/* --- Navbar (Hamburger Menu) --- */}
      <div className={active?"active":" "}>

    

      {/* Logo */}
           <img
        src="../images/logo.png"
        alt="Logo"
        style={{
          position: "absolute",
          top: "5%",
          left: "5%",
          width: "clamp(50px, 8vw, 70px)",
          height: "auto",
          zIndex: 11,
        }}
      />
      
      

     </div>
    </>
  );
}
