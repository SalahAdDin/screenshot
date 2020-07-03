import fs from "fs";
// import { google } from "googleapis";
import React, { useState } from "react";
import screenshotmachine from "screenshotmachine";
import logo from "./logo.svg";
import "./App.css";

//const readline = require("readline");

function App() {
  const [url, setUrl] = useState("");

  const handleOnChangeValue = (e) => {
    setUrl(e.target.value);
  };

  const takescreenshot = () => {
    const customerKey = "26cb2d";
    const secretPhrase = ""; //leave secret phrase empty, if not needed
    let options = {
      //mandatory parameter
      url: url,
      // all next parameters are optional, see our website screenshot API guide for more details
      dimension: "1920x1080", // or "1366xfull" for full length screenshot
      device: "desktop",
      format: "jpg",
      cacheLimit: "0",
      delay: "200",
      zoom: "100",
    };
    console.log("====================================");
    console.log(url, options, customerKey);
    console.log("====================================");
    if (url) {
      let filename = `ID_${url.split(".")[1]}`;

      const apiURL = screenshotmachine.generateScreenshotApiUrl(
        customerKey,
        secretPhrase,
        options
      );

      console.log("====================================");
      console.log(apiURL, filename);
      console.log("====================================");

      // screenshotmachine.readScreenshot(apiURL).pipe(
      //   fs.createWriteStream(filename).on("close", () => {
      //     console.log("Screenshot saved as " + filename);
      //   })
      // );
    }
  };

  return (
    <div className="App">
      <h1>Take a screenshot</h1>
      <p className="Lead">
        Just introduce the website's url and click to take a screenshot.
      </p>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon3">
            https://
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          id="basic-url"
          aria-describedby="basic-addon3"
          onChange={(e) => handleOnChangeValue(e)}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-primary"
            type="button"
            id="button-addon"
            onClick={takescreenshot}
          >
            Shot!
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
