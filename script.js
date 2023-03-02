data = {};
(async () => {
  loadedJSON = await fetch("./data.json");
  loadedJSON = await loadedJSON.json();
  data = JSON.parse(JSON.stringify(loadedJSON));
  console.log(data);
  loadTopic(topic);
})();

//initialize
var a = "cd";
var obj;
var objo;
var topics = ["Cengage AOD"];
var topic = topics[0];

// key1 and etc...
/*list.addEventListener("change",function(){
      loadTopic(this.value);

  });*/

async function loadTopic(top) {
  console.log("started");

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
                  <div class="question"> ${obj1[qname].q} </div>
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

  MathJax.typeset();

  function showResults() {
    // gather answer containers from our quiz

    const answerContainers = quizContainer.querySelectorAll(".answers");

    // keep track of user's answers
    let numCorrect = 0;

    var index = [];

    for (var x in obj1) {
      index.push(x);
    }

    // for each question...
    for (var i = 1; i <= Object.keys(obj1).length - 1; i++) {
      var qname = index[i];

      // find selected answer
      const answerContainer = answerContainers[i - 1];
      const selector = `input:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      // if answer is correct
      if (userAnswer == obj1[qname].ans) {
        // add to the number of correct answers
        numCorrect++;

        // color the answers green
        answerContainers[i - 1].style.color = "lightgreen";
      } else {
        // if answer is wrong or blank
        // color the answers red
        var cv = document.createElement("div");
        cv.classList.add(".question");
        cv.innerHTML = `Correct Answer: ${obj1[qname].ans}`;
        answerContainers[i - 1].appendChild(cv);
        answerContainers[i - 1].style.color = "red";
      }
    }

    // show number of correct answers out of total
    var ef = `${numCorrect} out of ${Object.keys(obj1).length} correct`;
    alert(ef);
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

  function showNextSlide() {
    showSlide(currentSlide + 1, true);
  }

  function clearResponse() {
    const answerContainer = quizContainer.querySelectorAll(".answers");
    var cc = answerContainer[0].querySelectorAll("input");
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

  let currentSlide = 0;
  showSlide(currentSlide, false);

  // on submit, show results
  submitButton.addEventListener("click", showResults);

  nextButton.addEventListener("click", showNextSlide);

  clearButton.addEventListener("click", clearResponse);

  markButton.addEventListener("click", markAndNextSlide);

  previousButton.addEventListener("click", showPreviousSlide);

  const pContainers = document.querySelectorAll(".item");
  for (var i = 0; i < pContainers.length; i++) {
    pContainers[i].addEventListener("click", function () {
      showSlide(parseInt(this.textContent, 10) - 1, false);
    });
  }
}
