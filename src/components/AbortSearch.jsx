import { useEffect, useMemo, useRef, useState } from "react";

function useDebouncedValue(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timerId = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timerId);
    }, [value, delay]);

    return debounced;
}

function AbortSearch() {
    const [games, setGames] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState("all");
    const debouncedSelectedPlatform = useDebouncedValue(selectedPlatform, 300);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const requestId = useRef(0);
    const availablePlatforms = ["all", "pc", "browser"];

    const fetchGamesByPlatform = async (abortController, platform) => {
        setIsError(false);
        setIsLoading(true);
        const currRequestId = requestId.current;
        console.log(platform);
        try {
            const res = await fetch(
                `/api/api/games?platform=${encodeURIComponent(platform)}`,
                {
                    signal: abortController.signal,
                },
            );
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const data = await res.json();
            if (currRequestId !== requestId.current) return;
            setGames(data);
            console.log(data);
        } catch (error) {
            if (currRequestId !== requestId.current) return;
            if (error?.name === "AbortError") return;
            setIsError(true);
            console.log("Fetching failed!!!");
        } finally {
            if (currRequestId === requestId.current) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        requestId.current++;
        const abortController = new AbortController();
        fetchGamesByPlatform(abortController, debouncedSelectedPlatform.trim());
        return () => {
            abortController.abort();
        };
    }, [debouncedSelectedPlatform]);

    const filteredList = useMemo(
        () =>
            [...games].sort((a, b) =>
                a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
            ),
        [games],
    );

    useEffect(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.delete("platform");
        if (debouncedSelectedPlatform === "") {
            window.history.replaceState({}, "", window.location.pathname);
        } else {
            urlSearchParams.set("platform", selectedPlatform);
            window.history.replaceState(
                {},
                "",
                window.location.pathname + "?" + urlSearchParams.toString(),
            );
        }
    }, [debouncedSelectedPlatform, selectedPlatform]);

    if (isError) return <h1>Something Went Wrong</h1>;

    return (
        <>
            <div style={{ maxWidth: "150px" }}>
                <p>Number of entires: {filteredList.length}</p>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                    >
                        {availablePlatforms.map((platform) => (
                            <option key={platform} value={platform}>
                                {platform}
                            </option>
                        ))}
                    </select>
                </div>
                {isLoading ? (
                    <div>Updating...</div>
                ) : (
                    <ul
                        style={{
                            listStyle: "none",
                            display: "flex",
                            justifyContent: "left",
                            flexDirection: "column",
                            padding: "0",
                        }}
                    >
                        {filteredList.map((game) => (
                            <li
                                key={game.id}
                                style={{ textAlign: "left", textWrap: "auto" }}
                            >
                                {game.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}

export default AbortSearch;
