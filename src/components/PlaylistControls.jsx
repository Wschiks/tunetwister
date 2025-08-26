import { useState } from "react";


export default function PlaylistControls({ token, deviceId, playlistTracks, currentTrackUri, setCurrentTrackUri }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const restartTrack = async () => {
        if (!deviceId || !currentTrackUri) return;

        await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
                method: "PUT",
                body: JSON.stringify({ uris: [currentTrackUri], position_ms: 0 }),
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            }
        );
        setIsPlaying(true);
    };

    const togglePlayPause = async () => {
        if (!deviceId) return;

        await fetch(`https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}?device_id=${deviceId}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        });

        setIsPlaying(!isPlaying);
    };

    const nextSongRandom = async () => {
        if (!deviceId || !playlistTracks.length) return;

        // Pick a random track from the playlist
        const randomTrack = playlistTracks[Math.floor(Math.random() * playlistTracks.length)];

        await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
                method: "PUT",
                body: JSON.stringify({ uris: [randomTrack], position_ms: 0 }),
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            }
        );

        setCurrentTrackUri(randomTrack);
        setIsPlaying(true);
    };

    return (
        <div className="flex gap-2 mb-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={restartTrack}>
                Restart
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onClick={togglePlayPause}>
                {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={nextSongRandom}>
                skip
            </button>
        </div>
    );
}
