var bodyParser = require("body-parser");
var cors = require("cors");
const express = require("express");
const app = express();
const fs = require("fs");
const readline = require("readline");
const request = require("request");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

app.use(cors());
// Parses the body for POST, PUT, DELETE, etc.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", function (req, res, next) {
  console.log(req.body.screenshot.filename, req.body.screenshot.apiURL); // req.body contains the parsed body of the request.
  // Load client secrets from a local file.
  filename = req.body.screenshot.filename;
  apiURL = req.body.screenshot.apiURL;
  function uploadFile(auth) {
    const folderId = "1Yb9IbvSp5DT2MLmglUbulAxy7vZAPH3K";
    const drive = google.drive({ version: "v3", auth });

    const fileMetadata = {
      name: filename,
      parents: [folderId],
    };

    request.head(apiURL, (err, res, body) => {
      request(apiURL).pipe(
        fs.createWriteStream(filename).on("close", () => {
          console.log("Screenshot saved as " + filename);
          var media = {
            mimeType: "image/jpeg",
            body: fs.createReadStream(filename),
          };

          drive.files.create(
            {
              resource: fileMetadata,
              media: media,
              fields: "id",
            },
            function (err, file) {
              if (err) {
                // Handle error
                console.error(err);
              } else {
                // TODO: file.id is ever invalid
                console.log("File Id: ", file.id);
              }
            }
          );
        })
      );
    });
  }

  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), uploadFile);
  });
});

app.listen(9000, function () {
  console.log("Example app listening on port 9000!");
});
