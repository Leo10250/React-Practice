import React, { useEffect, useRef, useState } from "react";

// TODO: implement this hook
function usePrevious(value) {
    const ref = useRef(null);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    // eslint-disable-next-line react-hooks/refs
    return ref.current;
}

export function SearchBox() {
    const [inputValue, setInputValue] = useState("");
    const previousValue = usePrevious(inputValue);

    return (
        <div style={{ padding: 16, fontFamily: "sans-serif" }}>
            <h2>Search</h2>

            <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Type to search..."
                style={{ padding: 8, width: 240 }}
            />

            <div style={{ marginTop: 16 }}>
                <div>Current value: {inputValue}</div>
                <div>Previous value: {previousValue ?? "undefined"}</div>
            </div>
        </div>
    );
}
