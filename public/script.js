var socket = io();
var currentSlide = 0;

var quesContainers = null;
var quesContainer = null;
var interval = null;
var numQues = 0;
var totalTime = 0;
var remainingTime = 0;

data = {};
(async () => {
  loadedJSON = await fetch("./testData.json");
  loadedJSON = await loadedJSON.json();
  data = JSON.parse(JSON.stringify(loadedJSON));
  console.log(data);

  getTopics();
})();

//initialize
var a = "cd";
var obj;
var objo;
var topics = [];

function getTopics() {
  topics = Object.keys(data);
  topicTabsContainer = document.querySelector("#section_names");
  topicTabsContainer.innerHTML = "";
  for (topic of topics) {
    topicTabsContainer.innerHTML += `<div class = 'section_unselected' data-topic = "${topic}" onclick="loadTopic('${topic}')">${topic}</div>`;
  }
  topicTabsContainer.firstChild.click();
}

// key1 and etc...
/*list.addEventListener("change",function(){
      loadTopic(this.value);

  });*/

async function loadTopic(top) {
  console.log("started");
  allTabElements = document.querySelectorAll("[data-topic]");
  for (element of allTabElements) {
    element.className = "section_unselected";
  }

  tabElement = document.querySelector("[data-topic='" + top + "']");
  tabElement.className = "section_selected";
  obj = data[top];
  start(obj, top);
}

function start(obj1, top1) {
  var palette = document.getElementById("palette-list");
  palette.innerHTML = "";
  const output = [];

  var index = [];

  for (var x in obj1) {
    index.push(x);
  }

  var keyys = Object.keys(obj1);
  console.log("yes " + keyys[0]);

  const previousButton1 = document.getElementById("pre");
  const chooseText = document.getElementById("choose_text");

  previousButton1.style.opacity = "0";
  palette.classList.remove("non_clickable");
  numQues = index.length - 1;
  totalTime = numQues * 2 * 60; //2 min per question
  remainingTime = totalTime;
  runTimer();

  for (var i = 0; i < index.length - 1; i++) {
    const answers = [];
    //var qname2 = "Q" + i.toString();
    var qname = i + 1;

    answers.push(
      `<label>
                  <input type="radio" name="${qname}" value="A">
                  ${obj1[qname].o1}
                  </label>`
    );
    answers.push(
      `<label>
                  <input type="radio" name="${qname}" value="B">
                  ${obj1[qname].o2}
                  </label>`
    );
    answers.push(
      `<label>
                  <input type="radio" name="${qname}" value="C">
                  ${obj1[qname].o3}
                  </label>`
    );
    answers.push(
      `<label>
                  <input type="radio" name="${qname}" value="D">
                  ${obj1[qname].o4}
                  </label>`
    );
    // add this question and its answers to the output
    var x = output.push(
      `<div class="slide">
                  <div class="question" data-timer= "0"> ${obj1[qname].q} </div>
                  <div class="answers"> ${answers.join("")} </div>
                  </div>`
    );

    var node = document.createElement("div");
    node.classList.add("nv");
    node.classList.add("item");
    node.innerHTML = (i + 1).toString();
    palette.appendChild(node);
  }
  const quizContainer = document.getElementById("quiz");

  quizContainer.innerHTML = output.join("");
  quesContainers = quizContainer.querySelectorAll(".question");

  MathJax.typesetPromise()
    .then(() => {
      console.warn("Mathjax expression successfully compiled");
    })
    .catch((err) => console.log("Typeset failed: " + err.message));

  function runTimer() {
    interval = setInterval(() => {
      if (!quesContainer) {
        return;
      }
      time = parseInt(quesContainer.getAttribute("data-timer"));
      quesContainer.setAttribute("data-timer", (time + 1).toString());
      remainingTime--;
      if (remainingTime <= 0) {
        document.querySelector("#submit").click();
        return;
      }
      document.querySelector("#remainingTime").innerHTML = `${(
        (remainingTime - (remainingTime % 60)) /
        60
      )
        .toString()
        .padStart(2, "0")}:${(remainingTime % 60).toString().padStart(2, "0")}`;
    }, 1000);
  }

  function showResults() {
    // gather answer containers from our quiz
    clearInterval(interval);
    var timeUsed = totalTime - remainingTime;
    const answerContainers = quizContainer.querySelectorAll(".answers");
    var dc = palette.childNodes;
    document.querySelector("#next_options").style.display = "none";
    document.querySelector("#submit_container").style.display = "none";

    // keep track of user's answers
    let numCorrect = 0;
    let attemptedQues = {}; //{questionNum: timeTaken}
    var index = [];

    for (var x in obj1) {
      index.push(x);
    }
    numAnswersAttempted = 0;
    // for each question...
    for (var i = 1; i <= Object.keys(obj1).length - 1; i++) {
      var qname = index[i];

      // find selected answer
      const answerContainer = answerContainers[i - 1];
      const time = quesContainers[i - 1].getAttribute("data-timer");
      //displaying time taken
      quesContainers[i - 1].innerHTML =
        `<span class="timeTaken">[${(parseInt(time) / 60).toFixed(
          2
        )} min]</span><br>` + quesContainers[i - 1].innerHTML;

      const selector = `input:checked`;
      //to filter out unattempted questions(question with no answer and less than 1 min spent)
      if (
        !answerContainer.querySelector(selector) &&
        parseInt(quesContainers[i - 1].getAttribute("data-timer")) < 60
      ) {
        dc[i - 1].style.display = "none";
        continue;
      }
      attemptedQues[i] = parseInt(
        quesContainers[i - 1].getAttribute("data-timer")
      );

      // (NOT TO INCLUDE ATTEMPTED BUT NOT ANSWERED below)include only answered questions in counting number of answered questions
      if (answerContainer.querySelector(selector)) {
        numAnswersAttempted++;
      }
    }
    socket.emit("result", JSON.stringify(attemptedQues));
    alert(
      `Congratulations, you have attempted ${numAnswersAttempted} questions in ${(
        timeUsed / 60
      ).toFixed(2)} minutes. Average Time = ${(
        timeUsed /
        60 /
        numAnswersAttempted
      ).toFixed(2)} min/ques`
    );
  }

  function showSlide(n, value) {
    var qname = (currentSlide + 1).toString();
    const answerContainer = document.querySelectorAll(".answers")[currentSlide];

    const selector = `input:checked`;

    var answerInput = answerContainer.querySelector(selector);

    var dc = palette.childNodes;

    if (
      answerInput != null &&
      !dc[currentSlide].classList.contains("amr") &&
      !dc[currentSlide].classList.contains("mr")
    ) {
      dc[currentSlide].classList.remove("nv", "na");
      dc[currentSlide].classList.add("a");
    }
    if (answerInput != null && dc[currentSlide].classList.contains("mr")) {
      dc[currentSlide].classList.remove("mr");
      dc[currentSlide].classList.add("amr");
    }

    if (answerInput != null && value == true) {
      dc[currentSlide].classList.remove("mr", "amr", "na");
      dc[currentSlide].classList.add("a");
    }

    if (n != index.length - 1) {
      slides[currentSlide].classList.remove("active-slide");
      slides[n].classList.add("active-slide");
      quesContainer = quesContainers[n];

      currentSlide = n;
      qname = (currentSlide + 1).toString();

      obj3 = data[top1];

      var qnoContainer = document.getElementById("question-title");
      var dc = palette.childNodes;
      if (dc[currentSlide].classList.contains("nv")) {
        var dc = palette.childNodes;
        dc[currentSlide].classList.remove("nv");
        dc[currentSlide].classList.add("na");
        qnoContainer.innerHTML = "Question no. " + (currentSlide + 1);
      }
    }
  }

  function showNextSlide(currSlide) {
    showSlide(currSlide + 1, true);
  }

  function clearResponse(n) {
    const answerContainer = quizContainer.querySelectorAll(".answers");
    var cc = answerContainer[n].querySelectorAll("input");

    var dc = palette.childNodes;
    dc[n].classList.remove("a");
    dc[n].classList.add("na");
    for (var i = 0; i < cc.length; i++) {
      cc[i].checked = false;
    }
  }

  function markAndNextSlide() {
    var dc = palette.childNodes;
    dc[currentSlide].classList.remove("nv", "na", "a");
    dc[currentSlide].classList.add("mr");
    showSlide(currentSlide + 1, false);
  }

  function showPreviousSlide() {
    showSlide(currentSlide - 1, false);
  }

  const quizContainer1 = document.getElementById("quiz");
  var resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");

  const previousButton = document.getElementById("pre");

  // display quiz right away
  //buildQuiz();

  const nextButton = document.getElementById("next");
  const markButton = document.getElementById("mfran");
  const clearButton = document.getElementById("cr");
  const slides = document.querySelectorAll(".slide");

  showSlide(currentSlide, false);

  // on submit, show results
  submitButton.addEventListener("click", showResults);

  nextButton.onclick = () => {
    return false;
  };
  nextButton.onclick = () => {
    showNextSlide(currentSlide);
  };
  clearButton.addEventListener("click", () => {
    clearResponse(currentSlide);
  });

  markButton.addEventListener("click", markAndNextSlide);

  previousButton.addEventListener("click", showPreviousSlide);

  const pContainers = document.querySelectorAll(".item");
  for (var i = 0; i < pContainers.length; i++) {
    pContainers[i].addEventListener("click", function () {
      showSlide(parseInt(this.textContent, 10) - 1, false);
    });
  }
}
