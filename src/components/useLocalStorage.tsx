import React, { useEffect, useState } from "react";

// TODO: implement this hook
function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, (value: T) => void] {
    const [value, setValue] = useState(() => {
        try {
            const v = window.localStorage.getItem(key);
            if (v == null) {
                return initialValue;
            }
            return JSON.parse(v);
        } catch (error) {
            return initialValue;
        }
    });
    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Failed to save to local storage!");
        }
    }, [key, value]);
    return [value, setValue];
}

function SettingsPanel() {
    const [username, setUsername] = useLocalStorage("username", "");
    const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);

    return (
        <div style={{ padding: 16, fontFamily: "sans-serif" }}>
            <h2>Settings</h2>

            <div style={{ marginBottom: 16 }}>
                <label>
                    Username
                    <input
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Enter username"
                        style={{
                            display: "block",
                            marginTop: 8,
                            padding: 8,
                            width: 240,
                        }}
                    />
                </label>
            </div>

            <div style={{ marginBottom: 16 }}>
                <label>
                    <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(event) => setDarkMode(event.target.checked)}
                    />
                    Enable dark mode
                </label>
            </div>

            <div>
                <div>Saved username: {username}</div>
                <div>Dark mode: {darkMode ? "On" : "Off"}</div>
            </div>
        </div>
    );
}

export default function App() {
    return <SettingsPanel />;
}
