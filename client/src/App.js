import React, { useState } from "react";
import screenshotmachine from "screenshotmachine";
import logo from "./logo.svg";
import "./App.css";

//const readline = require("readline");

function App() {
  const [url, setUrl] = useState("");
  const [id, setId] = useState(1);

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
    if (url) {
      let filename = `${id}_${url.split(".")[1]}.jpg`;

      const apiURL = screenshotmachine.generateScreenshotApiUrl(
        customerKey,
        secretPhrase,
        options
      );
      const res = fetch("http://localhost:9000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          screenshot: {
            apiURL: apiURL,
            filename: filename,
          },
        }),
      });
      setId(id + 1);

      // TODO: send an alert to notify it was good
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
