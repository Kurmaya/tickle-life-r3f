import React, { useState } from "react";
import { Oxanium, Saira_Condensed } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ['500'],
});


const TabletForm = ({ trigger, triggerExplosion, formRef }) => {
    const [formData, setFormData] = useState({
    totalMonthlyIncome: "",
    averageTicketSize: "",
    visaMasterVolume: "",
    otherCardVolume: "",
    companyLocation: "",
    industry: "",
  });

  // ----------- HANDLERS -----------
  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    // option1
    <div
      ref={formRef}
      className={
        trigger || triggerExplosion
          ? "form futuristic-tablet active"
          : "form futuristic-tablet"
          
      }
      
    >
      
  

      {/* INPUT SET */}
      <div
      className={oxanium.className}
        style={{
          width: "100%",
          display: "grid",
          placeItems: "center",
          gridTemplateColumns: "1fr",
          gap: "10px",
        }}
      >
         <div className="lbl" style={{ width: "95%" }}>
    <label
      style={{
        color: "#00eaff",
        fontSize: "1rem",
        marginBottom: "5px",
        display: "block",
      }}
    >
      Total Monthly Income (USD) *
    </label>

    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input 
      autoFocus={true}
        type="range"
        min="0"
        max="10000"
        step="100"
        name="totalMonthlyIncome"
        value={formData.totalMonthlyIncome}
        onChange={handleInput}
        
      />

      <input
        type="number"
        min="0"
        max="10000"
        step="100"
        name="totalMonthlyIncome"
        value={formData.totalMonthlyIncome}
        onChange={handleInput}
        style={{
          width: "85px",
          padding: "6px",
          borderRadius: "10px",
          border: "2px solid rgba(0,255,255,0.35)",
          background: "rgba(0,10,18,0.9)",
          color: "#00eaff",
          outline: "none",
        }}
      />
    </div>
  </div>
    <div className="lbl" style={{ width: "95%" }}>
    <label
      style={{
        color: "#00eaff",
        fontSize: "1rem",
        marginBottom: "5px",
        display: "block",
      }}
    >
      Average Ticket Size (USD) *
    </label>

    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="range"
        min="0"
        max="10000"
        step="100"
        name="averageTicketSize"
        value={formData.averageTicketSize}
        onChange={handleInput}
        
      />

      <input
        type="number"
        min="0"
        max="10000"
        step="100"
        name="averageTicketSize"
        value={formData.averageTicketSize}
        onChange={handleInput}
        style={{
          width: "85px",
          padding: "6px",
          borderRadius: "10px",
          border: "2px solid rgba(0,255,255,0.35)",
          background: "rgba(0,10,18,0.9)",
          color: "#00eaff",
          outline: "none",
        }}
      />
    </div>
  </div>

  {/* Monthly Volume */}
  <div className="lbl" style={{ width: "95%" }}>
    <label
      style={{
        // color: "#00eaff",
        fontSize: "1rem",
        marginBottom: "5px",
        display: "block",
      }}
    >
      Visa/Mastercard Volume (USD) *
    </label>

    <div className="lbl" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="range"
        min="0"
        max="100000"
        step="1000"
        name="visaMasterVolume"
        value={formData.visaMasterVolume}
        onChange={handleInput}
        
      />

      <input
        type="number"
        min="0"
        max="100000"
        step="1000"
        name="visaMasterVolume"
        value={formData.visaMasterVolume}
        onChange={handleInput}
        style={{
          width: "85px",
          padding: "6px",
          borderRadius: "10px",
          border: "2px solid rgba(0,255,255,0.35)",
          background: "rgba(0,10,18,0.9)",
          color: "#00eaff",
          outline: "none",
        }}
      />
    </div>
  </div>

  {/* other cards */}
  <div className="lbl" style={{ width: "95%" }}>
    <label
      style={{
        color: "#00eaff",
        fontSize: "1rem",
        marginBottom: "5px",
        display: "block",
      }}
    >
      Other Cards Volume (USD) *
    </label>

    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <input
        type="range"
        min="0"
        max="20"
        step="0.1"
        width='75%'
        name="otherCardVolume"
        value={formData.otherCardVolume}
        onChange={handleInput}
        
      />

      <input
        type="number"
        min="0"
        max="20"
        step="0.1"
        name="otherCardVolume"
        value={formData.otherCardVolume}
        onChange={handleInput}
        style={{
          width: "70px",
          padding: "6px",
          borderRadius: "10px",
          border: "2px solid rgba(0,255,255,0.35)",
          background: "rgba(0,10,18,0.9)",
          color: "#00eaff",
          outline: "none",
        }}
      />
    </div>
  </div>


        {/* DROPDOWNS */}
        <div className="row">

        <select
          style={{
            width: "95%",
            padding: "0.4rem",
            borderRadius: "12px",
            background: "rgba(0,10,18,0.9)",
            border: "2px solid rgba(0,255,255,0.25)",
            borderBottom: "4px solid #00eaff",
            color: "#00eaff",
            fontSize: "1rem",
            cursor: "pointer",
            outline: "none",
            boxShadow: "0 0 12px rgba(0,255,255,0.2)",
            appearance: "none",
            transition: "0.2s",
          }}
          defaultValue={'Country of Registration'}
        >
     <option disabled selected>
            Country of Registration *
          </option>
          <option value="usa">USA</option>
          <option value="uk">UK</option>
          <option value="india">India</option>
          <option value="eu">EU</option>
          <option value="uae">UAE</option>
          <option value="singapore">Singapore</option>
          <option value="other">Other</option>
        </select>

        <select
          style={{
            width: "95%",
            padding: "0.4rem",
            borderRadius: "12px",
            background: "rgba(0,10,18,0.9)",
            border: "2px solid rgba(0,255,255,0.25)",
            borderBottom: "4px solid #00eaff",
            color: "#00eaff",
            fontSize: "1rem",
            cursor: "pointer",
            outline: "none",
            boxShadow: "0 0 12px rgba(0,255,255,0.2)",
            appearance: "none",
            transition: "0.2s",
          }}
          defaultValue={'Industry'}
        >
          <option disabled selected>
            Industry *
          </option>
          <option value="ecommerce">E-Commerce</option>
          <option value="travel">Travel</option>
          <option value="gaming">Gaming</option>
          <option value="crypto">Crypto / Web3</option>
          <option value="software">Software / SaaS</option>
          <option value="other">Other</option>
        </select>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
      className={oxanium.className}
        style={{
          width: "95%",
          padding: "0.8rem",
          marginTop: "10px",
          borderRadius: "14px",
          background: "rgba(0,15,25,1)",
          border: "2px solid rgba(0,255,255,0.35)",
          borderBottom: "4px solid #00eaff",
          color: "#00eaff",
          fontSize: "1.25rem",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 0 18px rgba(0,255,255,0.35)",
          transition: "0.25s ease",
        }}
        onPointerOver={(e) => {
          e.target.style.background = "rgba(0,255,255,0.25)";
          e.target.style.boxShadow = "0 0 25px rgba(0,255,255,0.55)";
          e.target.style.borderBottom= "4px solid #D7B750 ";
        }}
        onPointerOut={(e) => {
          e.target.style.background = "rgba(0,15,25,1)";
          e.target.style.boxShadow = "0 0 18px rgba(0,255,255,0.35)";
          e.target.style.borderBottom= "4px solid #00eaff";
        }}
      >
        Calculate
      </button>
<p className={oxanium.className}>These rates are estimates for low-risk businesses. If your business involves higher risk, please reach out and we will provide a tailored rate based on your risk level and overall business needs.</p>      
    </div>
  
  );
};

export default TabletForm;
