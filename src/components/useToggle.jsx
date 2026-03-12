import { useState } from "react";

const useToggle = (initialValue = false) => {
    const [enabled, setEnabled] = useState(initialValue);
    const toggleEnabled = () => setEnabled((prev) => !prev);
    return [enabled, toggleEnabled, setEnabled];
}

// eslint-disable-next-line react-refresh/only-export-components
function Demo(){
    // eslint-disable-next-line no-unused-vars
    const [enabled, toggleEnabled, setEnabled] = useToggle();
    return (<div>DEMO</div>)
}