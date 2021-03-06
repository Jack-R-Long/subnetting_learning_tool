// Functions
function generateData() {
    // Generate random IP address.  Only Class A, B, C (first octet 0-223)
    var firstOctet = generateRandomOctet(223);
    var secondOctet = generateRandomOctet();
    var thirdOctet = generateRandomOctet();
    var fourthOctet = generateRandomOctet();
    ipAddress = firstOctet + "." + secondOctet + "." + thirdOctet + "." + fourthOctet;
    
    // Generate subnet values
    var classfulSubnetMask = [255, 255, 255, 255];
    var classlessSubnetMask = "";
    var [subnetOctetofInterest, bitsTakenSubnet] = generateRandomSubnetOctet();
    // var subnetValuesArray = subnetValuesArray[0];
    // var bitsTakenSubnet = subnetValuesArray[1];

    // Determine IP class and classful subnet mask
    var ipClass = '';
    var networkIDAnswer = '';
    if (firstOctet < 128) {
        ipClass = 'a';
        classfulSubnetMask = [255, 0, 0, 0];
        classlessSubnetMask = "255." + subnetOctetofInterest + ".0.0";
        bitsTakenSubnet += 8;
        networkIDAnswer = 'b';
    } else if ( firstOctet < 193){
        ipClass = 'b';
        classfulSubnetMask = [255, 255, 0, 0];
        classlessSubnetMask = "255.255" + "." + subnetOctetofInterest + ".0";
        bitsTakenSubnet += 16;
        networkIDAnswer = 'c';
    } else {
        ipClass = 'c';
        classfulSubnetMask = [255, 255, 255, 0];
        classlessSubnetMask = "255.255.255." + subnetOctetofInterest;
        bitsTakenSubnet += 24;
        networkIDAnswer = 'a';
    }
    
    // Determine network ID with Boolean opertation (IP AND classfull subnetmask)
    var networkID = String(firstOctet & classfulSubnetMask[0]) + '.' + String(secondOctet & classfulSubnetMask[1]) + '.' + String(thirdOctet & classfulSubnetMask[2]) + '.' + String(fourthOctet & classfulSubnetMask[3]); 
    // Create network ID answers
    var networkIDAnswers = {
        a: firstOctet + "." + secondOctet + "." + thirdOctet + "." + "0",
        b: firstOctet + "." + "0" + "." + "0" + "." + "0",
        c: firstOctet + "." + secondOctet + "." + "0" + "." + "0", 
    }

    // Determine subnet ID with Boolean operation (IP AND classLESS subnetmask)
    var subnetOctects = classlessSubnetMask.split(".");
    var subnetID = String(firstOctet & subnetOctects[0]) + '.' + String(secondOctet & subnetOctects[1]) + '.' + String(thirdOctet & subnetOctects[2]) + '.' + String(fourthOctet & subnetOctects[3]); 
    var firstValidHost = findFirstValidHost(subnetID);
    var subnetIDAnswers = {
        a: firstOctet + "." + secondOctet + "." + generateRandomSubnetOctet() + ".0",
        b: subnetID,
        c: firstOctet + "." + secondOctet + "." + generateRandomOctet() + "." + generateRandomOctet(),
    }



    // Update questions and answers 
    myQuestions = [
        {
            question: "What class is this IP address?",
            questionType: "multiple choice",
            ipAddress: ipAddress,
            subnetMask: classlessSubnetMask,
            cidrBits: bitsTakenSubnet,
            answers: {
                a: "Class A",
                b: "Class B",
                c: "Class C"
            },
            correctAnswer : ipClass
        },
        {
            question: "Network ID",
            questionType: "multiple choice",
            ipAddress: ipAddress,
            subnetMask: classlessSubnetMask,
            cidrBits: bitsTakenSubnet,
            answers: networkIDAnswers,
            correctAnswer : networkIDAnswer,
        },
        {
            question: "Subnet ID",
            questionType: "input answer",
            ipAddress: ipAddress,
            subnetMask: classlessSubnetMask,
            cidrBits: bitsTakenSubnet,
            answers: subnetIDAnswers,
            correctAnswer : subnetID
        },
        {
            question: "What is the first valid host?",
            questionType: "input answer",
            ipAddress: ipAddress,
            subnetMask: classlessSubnetMask,
            cidrBits: bitsTakenSubnet,
            answers: subnetIDAnswers,
            correctAnswer : firstValidHost
        },
    ]

}

function generateRandomOctet(upperLimit = 255){
    return Math.floor(Math.random() * upperLimit) + 1;
}

function generateRandomSubnetOctet(){
    var possibleVals = [128, 192, 224, 240, 248, 252, 254, 255];
    var randomIndex = Math.floor(Math.random() * 8);
    return [possibleVals[randomIndex], randomIndex + 1];
} 

function convertIPToInt(ipString) {
    // Function taken from https://tech.mybuilder.com/determining-if-an-ipv4-address-is-within-a-cidr-range-in-javascript/
    return ipString.split('.').reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;
}

function convertIntToIP(int) {
    // Function taken from https://tech.mybuilder.com/determining-if-an-ipv4-address-is-within-a-cidr-range-in-javascript/
    return [(int >>> 24) & 0xFF, (int >>> 16) & 0xFF, (int >>> 8) & 0xFF, int & 0xFF].join('.');
}

function findFirstValidHost(subnetIDString){
    let firstValidHostVal = convertIPToInt(subnetIDString) + 1;    
    return convertIntToIP(firstValidHostVal);
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

            // Generate radio buttons for multiple choice
            if (currentQuestion.questionType == "multiple choice") {
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
            }

            // Generate input field for fill in the blank
            else if (currentQuestion.questionType = "input answer") {
                answers.push(
                    `
                    <div class="form-group">
                    <p class="inputAnswers" id="answer${questionNumber}">${currentQuestion.correctAnswer}</p>
                    <input class="form-control" type="text" name="question${questionNumber}" placeholder="255.255.255.255" value="" id="input_${questionNumber}">
                    </div>
                    `
                );
            }

            // close form
            answers.push(`</div>`)

            // add this question and its answer to the output
            output.push(
                `<div class="slide mb-3">
                    <table class="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">IP</th>
                                <th scope="col">CIDR</th>
                                <th scope="col">Subnet Mask</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${currentQuestion.ipAddress}</td>
                                <td>/${currentQuestion.cidrBits}</td>
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
    const inputAnswer = document.getElementById(`input_${questionNumber}`);
    var userAnswer = "";

    // Find mc answers
    if (currentQuestion.questionType == "multiple choice"){
        const selector = `input[name=question${questionNumber}]:checked`;
        userAnswer = (answerContainer.querySelector(selector) || {}).value;
    }
    else if (currentQuestion.questionType == "input answer"){
        // get id of input field
        userAnswer = inputAnswer.value;
    }

    // if answer is correct
    if(userAnswer === currentQuestion.correctAnswer){
      // add to the number of correct answers
      numCorrect++;

      // color the answers green
      if (currentQuestion.questionType == "multiple choice"){
          answerContainers[questionNumber].style.color = 'lightgreen';
      } else {
          showAnswers(true);
          colorAnswers(questionNumber,'lightgreen')
      }
    }
    // if answer is wrong or blank
    else{
      // color the answers red
        if (currentQuestion.questionType == "multiple choice"){
          answerContainers[questionNumber].style.color = 'red';
      } else {
          showAnswers(true);
          colorAnswers(questionNumber, 'red');
      }
    }
  });

  // show number of correct answers out of total
  resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
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

function reloadPage() {
    window.location.reload();
}

function showAnswers(display_bool){
    var answerElements = document.getElementsByClassName('inputAnswers');
    // Answer elemnts is an HTML collection so we have to do some funky stuff
    Array.prototype.forEach.call(answerElements, function(answerElement) {
        if (display_bool) {
            answerElement.style.display = "block";
        } else {
            answerElement.style.display = "none";
        }
    });
}

function colorAnswers(questionNum, textColor) {
    var answerElement = document.getElementById('answer' + String(questionNum));
    answerElement.style.color = textColor;
}

// Variables 
var ipAddress = "";
var subnetMask = "";
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
showAnswers(false);

// Event listeners
submitButton.addEventListener('click', showResults);
previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);
