// node get-device.mjs

//send a request to spotify api to get all possble connected devices
import fetch from "node-fetch";
import { token, client_id, client_secret, redirect_uri, code } from "./config.mjs";

async function getDevices() {
    const res = await fetch("https://api.spotify.com/v1/me/player/devices", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    console.log(data.devices);
}

getDevices();
