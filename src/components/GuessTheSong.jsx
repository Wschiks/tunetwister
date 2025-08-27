// src/components/GuessTheSong.jsx
import {useState, useEffect, useRef} from "react"; // ⬅️ add useRef
import PlaylistControls from "./PlaylistControls.jsx";
import ColoredBox from "./ColoredBox.jsx";
import NextSongButton from "./NextSongButton.jsx";
import TrackSearch from "./TrackSearch.jsx";

export default function GuessTheSong({token, deviceId, playlistTracks, currentTrackUri, setCurrentTrackUri}) {
    const [gameDivColor, setGameDivColor] = useState("black");
    const [isGuessCorrect, setIsGuessCorrect] = useState(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);
    const [isHidden, setIsHidden] = useState(true);
    const [revealedTrack, setRevealedTrack] = useState(null);


    const handleClick = () => {
        setIsHidden(false); // show the div when button is clicked
    };

    const restarTimer = () => {
        setElapsedTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
    }

    const startNewSong = async () => {
        if (!playlistTracks.length || !deviceId) return;
        restarTimer();


        const randomTrack = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];
        setCurrentTrackUri(randomTrack);
        // Reset UI state for the new round
        setGameDivColor("black");
        setIsGuessCorrect(null);
        setQuery("");
        setRevealedTrack(null);

        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            body: JSON.stringify({uris: [randomTrack]}),
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
        });
    };

    const handleGuess = (track) => {
        if (!currentTrackUri) return;
        if (track.uri === currentTrackUri) {
            setGameDivColor("green");
            setIsGuessCorrect(true);
            setRevealedTrack(track);
            setQuery("");
            if (timerRef.current) clearInterval(timerRef.current); // stop timer
        } else {
            setGameDivColor("red");
            setIsGuessCorrect(false);
        }
    };


    // clear interval when component unmounts
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=25`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                const data = await res.json();
                setResults(data.tracks?.items || []);
            } catch (err) {
                console.error(err);
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, token]);

    return (
        <div className="p-4 max-w-md mx-auto relative h-[350px]">
            <div className={isHidden ? "hidden" : ""}>
                {!isGuessCorrect && currentTrackUri && (
                    <div className="text-white text-lg font-bold">⏱ {elapsedTime}s</div>
                )}
                {isGuessCorrect && (
                    <div className="text-green-400 text-lg font-bold">✅ Solved in {elapsedTime}s</div>
                )}

                <ColoredBox color={gameDivColor} track={revealedTrack} />

                {/*{isGuessCorrect === true && <NextSongButton onClick={startNewSong}/>}*/}

                <PlaylistControls
                    token={token}
                    deviceId={deviceId}
                    playlistTracks={playlistTracks}
                    currentTrackUri={currentTrackUri}
                    setCurrentTrackUri={setCurrentTrackUri}
                    startNewSong={startNewSong}
                />
                <TrackSearch
                    token={token}
                    query={query}
                    setQuery={setQuery}
                    results={results}
                    handleGuess={handleGuess}
                />
            </div>
            {!currentTrackUri && (
                <button
                    onClick={() => {
                        handleClick();
                        startNewSong();
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4 w-[400px] h-[100px] mt-[60px]"
                >
                    <h2 className="text-2xl">Start Game</h2>
                </button>

            )}
        </div>
    );
}
