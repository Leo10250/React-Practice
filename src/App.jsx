import { useEffect, useMemo, useState } from "react";
import "./App.css";
import {
  AchievementToasterProvider,
  useAchievementToaster,
} from "./components/AchievementToaster";
import Search from "./components/DebouncedSearch";
import AbortSearch from "./components/AbortSearch";
import Pagination  from "./components/Pagination";
import Pagination2 from "./components/Pagination2";
import InfiniteScroll from "./components/InfiniteScroll";
import Form from "./components/From";
import Modal from "./components/Modal";

const Demo = () => {
  const { addAchievement } = useAchievementToaster();
  return (
    <button
      onClick={() => {
        const id = crypto.randomUUID();
        addAchievement({
          id: id,
          title: `Trophy ${id} Unlocked!`,
          icon: "🏆",
          rarity: "rare",
        });
      }}
    >
      Trigger Achievement
    </button>
  );
};

function App() {
  return (
    // <AchievementToasterProvider>
    //   <Demo />
    // </AchievementToasterProvider>
    // <AbortSearch/>
    // <Search/>
    // <Pagination2/>
    // <InfiniteScroll/>
    // <Form/>
    <Modal/>
  );
}

export default App;
