import fetch from "node-fetch";
import { token, client_id, client_secret, redirect_uri, code } from "./config.mjs";

async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri,
        }),
    });

    const data = await response.json();
    console.log(data);
}

getAccessToken();
