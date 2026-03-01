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
  const [platforms, setPlatforms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchGames = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const res = await fetch("/api/api/games");
      const data = await res.json();
      const availablePlatforms = data.reduce(
        (acc, game) => acc.add(game.platform),
        new Set(),
      );
      setGames(data);
      setPlatforms(["all", ...availablePlatforms]);
      console.log(data);
    } catch (error) {
      setIsError(true);
      console.log("Fetching failed!!!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
            (game.platform === selectedPlatform || selectedPlatform === "all"),
        )
        .sort((a, b) =>
          a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
        ),
    [debouncedSearch, games, selectedPlatform],
  );

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.delete("search");
    urlSearchParams.delete("platform");
    if (debouncedSearch === "") {
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      urlSearchParams.set("search", debouncedSearch);
      urlSearchParams.append("platform", selectedPlatform);
      window.history.replaceState(
        {},
        "",
        window.location.pathname + "?" + urlSearchParams.toString(),
      );
    }
  }, [debouncedSearch, selectedPlatform]);

  if (isError) return <h1>Something Went Wrong</h1>;
  if (isLoading) return <h1>Loading!</h1>;

  return (
    <>
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
            {platforms.map((platform, i) => (
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
            <li key={game.id} style={{ textAlign: "left", textWrap: "auto" }}>
              {game.title}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Search;
