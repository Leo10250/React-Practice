import { useEffect, useRef, useState } from "react";

export const useOnClickOutside = (ref, func) => {
    useEffect(() => {
        const refs = Array.isArray(ref) ? ref : [ref];
        const handleClick = (event) => {
            for (const r of refs) {
                if (!r.current) {
                    continue;
                }
                if (r.current.contains(event.target)) {
                    return;
                }
            }
            func();
        };
        document.addEventListener("click", handleClick);

        return () => document.removeEventListener("click", handleClick);
    }, [ref, func]);
};

// eslint-disable-next-line react-refresh/only-export-components
function Demo() {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useOnClickOutside(ref, () => {
        setIsOpen(false);
    });
    return <>{isOpen}</>;
}
