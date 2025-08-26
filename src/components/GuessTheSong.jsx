// src/components/GuessTheSong.jsx
import { useState, useEffect } from "react";
import PlaylistControls from "./PlaylistControls.jsx";
import ColoredBox from "./ColoredBox.jsx";
import NextSongButton from "./NextSongButton.jsx";
import TrackSearch from "./TrackSearch.jsx";

export default function GuessTheSong({ token, deviceId, playlistTracks, currentTrackUri, setCurrentTrackUri }) {
    const [gameDivColor, setGameDivColor] = useState("black");
    const [isGuessCorrect, setIsGuessCorrect] = useState(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const startNewSong = async () => {
        if (!playlistTracks.length || !deviceId) return;
        const randomTrack = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];
        setCurrentTrackUri(randomTrack);
        setGameDivColor("black");
        setIsGuessCorrect(null);
        setQuery("");
        setResults([]);

        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            body: JSON.stringify({ uris: [randomTrack] }),
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
    };

    const handleGuess = (track) => {
        if (!currentTrackUri) return;
        if (track.uri === currentTrackUri) {
            setGameDivColor("green");
            setIsGuessCorrect(true);
        } else {
            setGameDivColor("red");
            setIsGuessCorrect(false);
        }
    };

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=25`,
                    { headers: { Authorization: `Bearer ${token}` } }
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
        <div className="p-4 max-w-md mx-auto relative">
            <ColoredBox color={gameDivColor} />
            {isGuessCorrect === true && <NextSongButton onClick={startNewSong} />}
            <PlaylistControls
                token={token}
                deviceId={deviceId}
                playlistTracks={playlistTracks}
                currentTrackUri={currentTrackUri}
                setCurrentTrackUri={setCurrentTrackUri}
            />
            <TrackSearch
                token={token}
                query={query}
                setQuery={setQuery}
                results={results}
                handleGuess={handleGuess}
            />
            {!currentTrackUri && (
                <button
                    onClick={startNewSong}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                >
                    Start Game
                </button>
            )}
        </div>
    );
}
