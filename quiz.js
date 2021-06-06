// Select HTML elements
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

// object literals to hold questiosns
const myQuestions = [
    {
        question: "What class is this IP address?",
        ipAddress: "188.26.221.100",
        answers: {
            a: "Class A",
            b: "Class B",
            c: "Class C"
        },
        correctAnswer : "b"
    },
    {
        question: "What class is this IP address?",
        ipAddress: "128.125.132.191",
        answers: {
            a: "Class A",
            b: "Class B",
            c: "Class C"
        },
        correctAnswer : "b"
    },
    {
        question: "What class is this IP address?",
        ipAddress: "83.93.100.48",
        answers: {
            a: "Class A",
            b: "Class B",
            c: "Class C"
        },
        correctAnswer : "a"
    },
    {
        question: "What class is this IP address?",
        ipAddress: "204.158.32.45 ",
        answers: {
            a: "Class A",
            b: "Class B",
            c: "Class C"
        },
        correctAnswer : "c"
    },
]

function buildQuiz(){
    // variable to store HTML output
    const output = [];

    // for each question
    myQuestions.forEach(
        (currentQuestion, questionNumber) => {

            // Variable to store the list of possible answers
            const answers = [];

            // create row
            answers.push(`<div class="form-check">`)

            // and for each avaliable answer
            for(letter in currentQuestion.answers) {

                // add HTML button
                answers.push(
                    `
                    <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="question${questionNumber}" value="${letter}">
                    <label class="form-check-label" for="question${questionNumber}">${currentQuestion.answers[letter]}</label>
                    </div>
                    `
                );
            }
            // close form
            answers.push(`</div>`)

            // add this question and its answer to the output
            output.push(
                `<h3> IP address: ${currentQuestion.ipAddress}</h3>
                <p> ${currentQuestion.question} </p>
                <div class="answers"> ${answers.join('')} </div>`
            );

        }
    );

    // finally combine our output list into one string of HTML place it on the page
    quizContainer.innerHTML = output.join('');
}

function showResults(){
    
  // gather answer containers from our quiz
  const answerContainers = quizContainer.querySelectorAll('.answers');

  // keep track of user's answers
  let numCorrect = 0;

  // for each question...
  myQuestions.forEach( (currentQuestion, questionNumber) => {

    // find selected answer
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;

    // if answer is correct
    if(userAnswer === currentQuestion.correctAnswer){
      // add to the number of correct answers
      numCorrect++;

      // color the answers green
      answerContainers[questionNumber].style.color = 'lightgreen';
    }
    // if answer is wrong or blank
    else{
      // color the answers red
      answerContainers[questionNumber].style.color = 'red';
    }
  });

  // show number of correct answers out of total
  resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
}

// display quiz right away
buildQuiz();

// on submit, show results 
submitButton.addEventListener('click', showResults);