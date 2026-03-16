import { useEffect, useMemo, useState } from "react";

function useDebouncedValue(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timerId = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timerId);
    }, [value, delay]);

    return debounced;
}

function Search() {
    const [games, setGames] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const debouncedSearch = useDebouncedValue(searchValue, 300);
    const [selectedPlatform, setSelectedPlatform] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    // Derived from games — no need for separate useState
    const platforms = ["all", ...new Set(games.map((g) => g.platform))];

    // Fetch inline inside effect to avoid missing dependency warnings
    useEffect(() => {
        const fetchGames = async () => {
            setIsError(false);
            setIsLoading(true);
            try {
                const res = await fetch("/api/games");
                const data = await res.json();
                setGames(data);
            } catch (error) {
                setIsError(true);
                console.error(`Fetching failed: ${error}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGames();
    }, []);

    const filteredList = useMemo(
        () =>
            games
                .filter(
                    (game) =>
                        game.title
                            .toLowerCase()
                            .startsWith(debouncedSearch.toLowerCase()) &&
                        (selectedPlatform === "all" ||
                            game.platform === selectedPlatform),
                )
                .sort((a, b) =>
                    a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
                ),
        [debouncedSearch, games, selectedPlatform],
    );

    // Sync filters to URL
    useEffect(() => {
        const params = new URLSearchParams();

        if (debouncedSearch) {
            params.set("search", debouncedSearch);
        }
        if (selectedPlatform !== "all") {
            params.set("platform", selectedPlatform);
        }

        const query = params.toString();
        const url = query
            ? `${window.location.pathname}?${query}`
            : window.location.pathname;

        window.history.replaceState({}, "", url);
    }, [debouncedSearch, selectedPlatform]);

    if (isError) return <h1>Something Went Wrong</h1>;
    if (isLoading) return <h1>Loading!</h1>;

    return (
        <div style={{ maxWidth: "150px" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                    placeholder="type your game"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                    {platforms.map((platform) => (
                        <option key={platform} value={platform}>
                            {platform}
                        </option>
                    ))}
                </select>
            </div>
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
        </div>
    );
}

export default Search;
