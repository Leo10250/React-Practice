import { useState } from "react";
import "./styles.css";

const initialMappings = [
    { action: "Jump", button: "X" },
    { action: "Crouch", button: "Circle" },
    { action: "Reload", button: "Square" },
    { action: "Interact", button: "Triangle" },
];

const availableButtons = ["X", "Circle", "Square", "Triangle", "L1", "R1"];

export default function KeybindManager() {
    const [keybinds, setKeybinds] = useState(initialMappings);
    const buttonCount = keybinds.reduce((map, keybind) => {
        map.set(keybind.button, (map.get(keybind.button) ?? 0) + 1);
        return map;
    }, new Map());
    const hasDuplicateKey = keybinds.some(
        (keybind) => buttonCount.get(keybind.button) > 1,
    );

    const mappedActionsCount = keybinds.length;
    const uniqueButtonsUsed = buttonCount.size;

    const handleSelect = (newButton, action) => {
        setKeybinds((prev) =>
            prev.map((item) => {
                if (item.action === action) {
                    return { ...item, button: newButton };
                } else {
                    return item;
                }
            }),
        );
    };

    const handleSave = () => {
        console.log(JSON.stringify(keybinds));
    };

    return (
        <>
            <ul>
                {keybinds.map((keybind) => (
                    <li key={keybind.action}>
                        <p>Action Name: {keybind.action}</p>
                        <select
                            value={keybind.button}
                            onChange={(e) =>
                                handleSelect(e.target.value, keybind.action)
                            }
                        >
                            {availableButtons.map((button) => (
                                <option key={button} value={button}>
                                    {button}
                                </option>
                            ))}
                        </select>
                        {buttonCount.get(keybind.button) > 1 && (
                            <p style={{ color: "red" }}>Key Already In Use</p>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={() => setKeybinds(initialMappings)}>Reset</button>
            <button onClick={handleSave} disabled={hasDuplicateKey}>
                Save
            </button>
            <p>Mapped actions: {mappedActionsCount}</p>
            <p>Unique buttons used: {uniqueButtonsUsed}</p>
        </>
    );
}
