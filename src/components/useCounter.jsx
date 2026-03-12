import { useState } from "react";

const useCounter = (initialValue, config = { step: 1, min: -Infinity, max: Infinity }) => {
    const clamp = (value) => Math.max(config.min, Math.min(config.max, value));
    const [count, setCount] = useState(clamp(initialValue));
    const increment = () => setCount((prev) => clamp(prev + config.step));
    const decrement = () => setCount((prev) => clamp(prev - config.step));
    const reset = () => setCount(clamp(initialValue));
    return [count, {increment, decrement, reset, setCount}];
}

// eslint-disable-next-line react-refresh/only-export-components
function Demo(){
    // eslint-disable-next-line no-unused-vars
    const [count, { increment, decrement, reset, setCount }] = useCounter(0);
}