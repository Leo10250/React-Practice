import React, { useRef, useState } from 'react';
import './App.css';

function CodeRedeem() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const [submittedCode, setSubmittedCode] = useState("");
  const [values, setValues] = useState({ value1: "", value2: "", value3: "" });

  const isValid =
    values.value1.length === 4 &&
    values.value2.length === 4 &&
    values.value3.length === 4;

  const regex = /[^A-Z0-9]/g;

  const handleChange1 = (e) => {
    const input = e.target.value.toUpperCase().replace(regex, "");
    setValues((prev) => ({ ...prev, value1: input }));
    if (input.length === 4) {
      ref2.current?.focus();
    }
  };

  const handleChange2 = (e) => {
    const input = e.target.value.toUpperCase().replace(regex, "");
    setValues((prev) => ({ ...prev, value2: input }));
    if (input.length === 4) {
      ref3.current?.focus();
    }
  };

  const handleChange3 = (e) => {
    const input = e.target.value.toUpperCase().replace(regex, "");
    setValues((prev) => ({ ...prev, value3: input }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
      <input
        ref={ref1}
        value={values.value1}
        onChange={handleChange1}
        maxLength={4}
        aria-label="Voucher code part 1"
      />
      <p>-</p>
      <input
        ref={ref2}
        value={values.value2}
        onChange={handleChange2}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && values.value2.length === 0) {
            ref1.current?.focus();
          }
        }}
        maxLength={4}
        aria-label="Voucher code part 2"
      />
      <p>-</p>
      <input
        ref={ref3}
        value={values.value3}
        onChange={handleChange3}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && values.value3.length === 0) {
            ref2.current?.focus();
          }
        }}
        maxLength={4}
        aria-label="Voucher code part 3"
      />
      <button
        disabled={!isValid}
        onClick={() =>
          setSubmittedCode(
            `${values.value1}-${values.value2}-${values.value3}`
          )
        }
      >
        Redeem
      </button>

      {submittedCode && <p>Redeeming: {submittedCode}</p>}
    </div>
  );
}

export default CodeRedeem;