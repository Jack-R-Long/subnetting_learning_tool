// Functions
function generateData() {
    // Generate random IP address.  Only Class A, B, C (first octet 0-223)
    var firstOctet = Math.floor(Math.random() * 223) + 1;
    var secondOctet = Math.floor(Math.random() * 255) + 1;
    var thirdOctet = Math.floor(Math.random() * 255) + 1;
    var fourthOctet = Math.floor(Math.random() * 255) + 1;
    ipAddress = firstOctet + "." + secondOctet + "." + thirdOctet + "." + fourthOctet;
    
    // Determine IP class and classful subnet mask
    var ipClass = '';
    var classfulSubnetMask = [255, 255, 255, 255];
    var networkIDAnswer = '';
    if (firstOctet < 128) {
        ipClass = 'a';
        classfulSubnetMask = [255, 0, 0, 0];
        networkIDAnswer = 'b';
    } else if ( firstOctet < 193){
        ipClass = 'b';
        classfulSubnetMask = [255, 255, 0, 0];
        networkIDAnswer = 'c';
    } else {
        ipClass = 'c';
        classfulSubnetMask = [255, 255, 255, 0];
        networkIDAnswer = 'a';
    }
    
    // Determine network ID. Boolean AND of IP address and classfull subnetmask
    var networkID = String(firstOctet & classfulSubnetMask[0]) + '.' + String(secondOctet & classfulSubnetMask[1]) + '.' + String(thirdOctet & classfulSubnetMask[2]) + '.' + String(fourthOctet & classfulSubnetMask[3]); 
    // Create network ID answers
    var networkIDAnswers = {
        a: firstOctet + "." + secondOctet + "." + thirdOctet + "." + "0",
        b: firstOctet + "." + "0" + "." + "0" + "." + "0",
        c: firstOctet + "." + secondOctet + "." + "0" + "." + "0", 
    }



    // Update questions and answers 
    myQuestions = [
        {
            question: "What class is this IP address?",
            ipAddress: ipAddress,
            subnetMask: subnetMask,
            answers: {
                a: "Class A",
                b: "Class B",
                c: "Class C"
            },
            correctAnswer : ipClass
        },
        {
            question: "Network ID",
            ipAddress: ipAddress,
            subnetMask: subnetMask,
            answers: networkIDAnswers,
            correctAnswer : networkIDAnswer,
        },
        {
            question: "Number of bits taken by subnet",
            ipAddress: ipAddress,
            subnetMask: subnetMask,
            answers: {
                a: "8",
                b: "10",
                c: "12"
            },
            correctAnswer : "c"
        },
        {
            question: "Subnet ID",
            ipAddress: ipAddress,
            subnetMask: subnetMask,
            answers: {
                a: "188.26.221.64",
                b: "188.26.221.96",
                c: "188.26.221.255"
            },
            correctAnswer : "b"
        },
    ]

}

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
                `<div class="slide">
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">IP </th>
                                <th scope="col">Subnet Mask</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${currentQuestion.ipAddress}</td>
                                <td>${currentQuestion.subnetMask}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <br>
                    <p> ${currentQuestion.question} </p>
                    <div class="answers"> ${answers.join('')} </div>
                </div>`
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

//   showAllSlides();
}

function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;
    if(currentSlide === 0){
      previousButton.style.display = 'none';
    }
    else{
      previousButton.style.display = 'inline-block';
    }
    if(currentSlide === slides.length-1){
      nextButton.style.display = 'none';
      submitButton.style.display = 'inline-block';
    }
    else{
      nextButton.style.display = 'inline-block';
      submitButton.style.display = 'none';
    }
}

function showNextSlide() {
    showSlide(currentSlide + 1);
}

function showPreviousSlide() {
    showSlide(currentSlide - 1);
}

// function showAllSlides() {
//     slides.forEach ((slideObj) => {
//         slideObj.classList.add('active-slide');
//     }
//     );
// }

function reloadPage() {
    window.location.reload()
}

// Variables 
var ipAddress = "";
var subnetMask = "255.255.255.240";
const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
var myQuestions = []


// Kick things off
generateData();
buildQuiz();

// Pagination
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

// Show first slide
showSlide(currentSlide);

// Event listeners
submitButton.addEventListener('click', showResults);
previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);
