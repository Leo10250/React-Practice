import { useEffect, useMemo, useState } from "react";

const Form = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const errors = useMemo(() => validateInputs(values), [values]);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });
  const isValid =
    values.email &&
    values.password &&
    values.confirmPassword &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  const submit = (e) => {
    e.preventDefault();
    setValues({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setTouched({ email: false, password: false, confirmPassword: false });
  };

  const updateValues = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  function validateInputs(v) {
    const emailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
    const newError = { email: "", password: "", confirmPassword: "" };
    if (!v.email) {
      newError.email = "Email cannot be Empty!";
    } else if (!emailRegex.test(v.email)) {
      newError.email = "Invalid Email!";
    } else {
      newError.email = "";
    }

    if (!v.password) {
      newError.password = "Password cannot be Empty!";
    } else if (v.password.length < 8) {
      newError.password = "Password is too short!";
    } else {
      newError.password = "";
    }
    if (!v.confirmPassword) {
      newError.confirmPassword = "You need to confirm your password!";
    } else if (v.confirmPassword !== v.password) {
      newError.confirmPassword = "Does not match password!";
    } else {
      newError.confirmPassword = "";
    }
    return newError;
  }

  return (
    <form onSubmit={(e) => submit(e)}>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        Email*
        <input
          name="email"
          value={values.email}
          onChange={(e) => updateValues(e)}
          onBlur={(e) => handleBlur(e)}
          style={{
            borderColor: errors.email && touched.email ? "red" : undefined,
          }}
        />
        {errors.email && touched.email && (
          <div style={{ color: "red" }}>{errors.email}</div>
        )}
      </label>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        Password*
        <input
          name="password"
          value={values.password}
          onChange={(e) => updateValues(e)}
          onBlur={(e) => handleBlur(e)}
          style={{
            borderColor:
              errors.password && touched.password ? "red" : undefined,
          }}
        />
        {errors.password && touched.password && (
          <div style={{ color: "red" }}>{errors.password}</div>
        )}
      </label>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        Confirm Password*
        <input
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={(e) => updateValues(e)}
          onBlur={(e) => handleBlur(e)}
          style={{
            borderColor:
              errors.confirmPassword && touched.confirmPassword
                ? "red"
                : undefined,
          }}
        />
        {errors.confirmPassword && touched.confirmPassword && (
          <div style={{ color: "red" }}>{errors.confirmPassword}</div>
        )}
      </label>
      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
};

export default Form;
