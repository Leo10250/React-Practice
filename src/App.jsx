import "./App.css";
import {
    AchievementToasterProvider,
    useAchievementToaster,
} from "./components/AchievementToaster";
import Search from "./components/DebouncedSearch";
import AbortSearch from "./components/AbortSearch";
import Pagination from "./components/Pagination";
import Pagination2 from "./components/Pagination2";
import InfiniteScroll from "./components/InfiniteScroll";
import Form from "./components/From";
import Modal from "./components/Modal";
import { AchievementToasterSub } from "./components/AchievementToasterSub";
import TrophySearch from "./components/TrophySearch";

const data = [
  { id: 1, title: "First Blood", points: 15, earned: true },
  { id: 2, title: "Treasure Hunter", points: 30, earned: false },
  { id: 3, title: "Master Explorer", points: 50, earned: true },
  { id: 4, title: "Speed Runner", points: 25, earned: false },
];

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
        // <Form />
        // <Modal/>
        // <AchievementToasterSub/>
        <TrophySearch data={data} />
    );
}

export default App;
