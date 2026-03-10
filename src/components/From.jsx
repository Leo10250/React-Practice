import { useState } from "react";

function validateInputs(v) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

const Form = () => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false,
        confirmPassword: false,
    });
    const errors = validateInputs(values);

    const isValid = Boolean(
        values.email &&
        values.password &&
        values.confirmPassword &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword,
    );

    const hasError = (type) => {
        return Boolean(touched[type] && errors[type]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isValid) return;
        setValues({
            email: "",
            password: "",
            confirmPassword: "",
        });
        setTouched({ email: false, password: false, confirmPassword: false });
    };

    const handleChange = (e) => {
        setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleBlur = (e) => {
        setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    };

    return (
        <form onSubmit={handleSubmit}>
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                        borderColor: hasError("email") ? "red" : undefined,
                    }}
                />
                {hasError("email") && (
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                        borderColor: hasError("password") ? "red" : undefined,
                    }}
                />
                {hasError("password") && (
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                        borderColor: hasError("confirmPassword")
                            ? "red"
                            : undefined,
                    }}
                />
                {hasError("confirmPassword") && (
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
