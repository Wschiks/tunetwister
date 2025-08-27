import {useEffect, useState} from "react";
import GuessTheSong from "./components/GuessTheSong";
import {token} from "../spotify-player/config.mjs";
import tunetwisterLogo from "./assets/tunetwister.png";


const playlistId = "0bIUgov7PqxNuASp4dQGYU";

export default function App() {
    const [deviceId, setDeviceId] = useState(null);
    const [currentTrackUri, setCurrentTrackUri] = useState(null);
    const [playlistTracks, setPlaylistTracks] = useState([]);

    // Load Spotify Web Playback SDK
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        script.onload = () => {
            const player = new window.Spotify.Player({
                name: "React Spotify Player",
                getOAuthToken: (cb) => cb(token),
                volume: 0.8,
            });
            player.addListener("ready", async ({device_id}) => {
                console.log("Ready with Device ID", device_id);
                setDeviceId(device_id);

                await fetch(" ", {
                    method: "PUT",
                    body: JSON.stringify({device_ids: [device_id], play: false}),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
            });
            player.addListener("not_ready", ({device_id}) => {
                console.log("Device went offline", device_id);
            });
            player.connect();
        };

        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, []);

    // Load playlist tracks
    useEffect(() => {
        async function loadPlaylistTracks() {
            try {
                const res = await fetch(
                    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                    {headers: {Authorization: `Bearer ${token}`}}
                );
                const data = await res.json();
                setPlaylistTracks(data.items.map(item => item.track.uri));
            } catch (err) {
                console.error("Error loading playlist tracks:", err);
            }
        }
        loadPlaylistTracks();
    }, []);

    return (
        <div className="p-6 align-middle justify-center w-screen text-center mt-[-200px]">
            <img
                src={tunetwisterLogo}
                alt="Tunetwister logo"
                className="mx-auto w-1/2 mb-6"
            />

            <GuessTheSong
                token={token}
                deviceId={deviceId}
                playlistTracks={playlistTracks}
                currentTrackUri={currentTrackUri}
                setCurrentTrackUri={setCurrentTrackUri}
            />
        </div>

    );
}
