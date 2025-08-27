import {useState} from "react";


export default function PlaylistControls({token, deviceId, playlistTracks, currentTrackUri, setCurrentTrackUri}) {
    const [isPlaying, setIsPlaying] = useState(false);

    const restartTrack = async () => {
        if (!deviceId || !currentTrackUri) return;

        await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
                method: "PUT",
                body: JSON.stringify({uris: [currentTrackUri], position_ms: 0}),
                headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
            }
        );
        setIsPlaying(true);
    };

    const togglePlayPause = async () => {
        if (!deviceId) return;

        await fetch(`https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}?device_id=${deviceId}`, {
            method: "PUT",
            headers: {Authorization: `Bearer ${token}`},
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
                body: JSON.stringify({uris: [randomTrack], position_ms: 0}),
                headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
            }
        );

        setCurrentTrackUri(randomTrack);
        setIsPlaying(true);
    };

    return (
        <div className="flex gap-2 mb-4 justify-center ">
            <button             className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 shadow-lg shadow-neutral-500/20 transition active:scale-95"
                                onClick={restartTrack}>
                Restart
            </button>
            <button             className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 shadow-lg shadow-neutral-500/20 transition active:scale-95"

                                onClick={togglePlayPause}>
                {isPlaying ? "Pause" : "Play"}
            </button>
            <button             className="inline-flex h-12 items-center justify-center rounded-md bg-neutral-950 px-6 font-medium text-neutral-50 shadow-lg shadow-neutral-500/20 transition active:scale-95"
                                onClick={nextSongRandom}>
                skip
            </button>
        </div>
    );
}
