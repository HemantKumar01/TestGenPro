const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

const socket = require("socket.io");

var data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
var done = JSON.parse(fs.readFileSync("./done.json", "utf8"));

var topics = Object.keys(data);
var numQuestionsInTopics = {};
var test = { Maths: [null] };
var numQues = 25;

app.get("/", (req, res) => {
  test = { Maths: [null] };
  done = JSON.parse(fs.readFileSync("./done.json", "utf8"));
  createPaper();
  res.sendFile("index.html", { root: "./public" });
});

app.use(express.static("public"));
app.use(
  "/socket.io",
  express.static(__dirname + "/node_modules/socket.io/client-dist/")
);

const serverInstance = app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
const io = new socket.Server(serverInstance);

io.on("connection", (socket) => {
  console.log("A connection is made using socket.io");
});

function createPaper() {
  for (var topic of topics) {
    //TODO: Subtract number of questions which are already attempted
    numQuestionsInTopics[topic] = data[topic].length - 1; // -1 because first value is set null in each topic by the creator (fool)
  }

  //sorting chapters (importance of chapters) by number of questions it has
  //TODO: Sort based on analysisData collected
  numQuestionsInTopics = Object.fromEntries(
    Object.entries(numQuestionsInTopics).sort(([, a], [, b]) => b - a)
  );

  //now using the sorted topics to create paper
  numQuesSelected = 0;
  iteration = 1; //starting with first iteration

  while (numQuesSelected < numQues) {
    for (var topic of Object.keys(numQuestionsInTopics)) {
      //start selecting from last questions (harder questions)
      //! no support when multiple subjects are present
      if (numQuestionsInTopics[topic] - iteration <= 0) {
        continue;
      }

      if (
        done[topic] &&
        done[topic].includes(numQuestionsInTopics[topic] - iteration)
      ) {
        continue;
      }
      let question = data[topic][numQuestionsInTopics[topic] - iteration];

      //some questions are faulty, removing these questions
      if (Object.keys(question).length < 5) {
        continue;
      }

      test.Maths.push(question);
      numQuesSelected++;
      if (numQuesSelected == numQues) {
        break;
      }
    }
    iteration++;
  }
  fs.writeFile("./public/testData.json", JSON.stringify(test), function (err) {
    if (err) {
      console.log(err);
    }
  });
}
