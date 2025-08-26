// config.example.mjs
// rename to config.mjs
//https://developer.spotify.com/dashboard
export const client_id = "YOUR_CLIENT_ID_HERE";
export const client_secret = "YOUR_CLIENT_SECRET_HERE";
export const redirect_uri = "YOURE_REDIRECT_URI_HERE";

// Authorization link
//https://accounts.spotify.com/authorize?client_id=[YOUR_CLIENT_ID_HERE]&response_type=code&redirect_uri=[YOURE_REDIRECT_URI_HERE]&scope=user-read-playback-state%20user-modify-playback-state%20user-read-currently-playing%20streaming%20user-top-read

// code from link
export const code = "YOUR_AUTHORIZATION_CODE_HERE";

// node exchange-code.mjs
export const token = "YOUR_ACCESS_TOKEN_HERE";




