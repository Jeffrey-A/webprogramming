const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");

app.use(express.json());

app.use(express.static(path.join(__dirname, "./front_end/build")));

app.post("/gif_search", (req, res) => {
  const searchTerm = req.body.searchTerm;
  axios
    .get(
      "http://api.giphy.com/v1/gifs/search?q=" +
        searchTerm +
        "&api_key=n5v0ys2kC8OaWWwSg4chpqA837dlrHZs"
    )
    .then(response => {
      const gifs = response.data.data.map(gifInfo => {
        return {
          gifUrl: gifInfo.images.preview_gif.url,
          focusUrl: gifInfo.images.fixed_width_still.url,
          fixed_height: gifInfo.images.fixed_height_still.url,
          title: gifInfo.title,
          key: gifInfo.id
        };
      });
      res.json({ result: gifs });
    })
    .catch(error => {
      console.log(error);
    });
});

app.listen(3001, () => console.log("server is running"));
