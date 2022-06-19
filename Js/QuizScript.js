let _question = document.getElementById('question');
let _options = document.querySelector('.Questions');
let _difficulty = document.getElementById('difficult');
let _type = document.getElementById('category');
let _correctScore = document.getElementById('CountQuestion');
let _totalQuestion = document.getElementById('totalQuestion');
let _checkAnswer = document.querySelectorAll('.Answer');
let _result = document.getElementById('Results');
let _Points = document.getElementById('PointsShow')
let _checkBtn = document.getElementById('BtnCheck');
let _retryBtn = document.getElementById('Btnretry');
let _selectedAnswer = document.getElementsByClassName('selected')
let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10, QuestionCorrect = 0, difficultOfQuestion = "", PointScores= 0;


async function SendApiRequest() {
    let response = await fetch('https://opentdb.com/api.php?amount=1');
    let data = await response.json();
    _result.innerHTML = "";
    useApiData(data.results[0]);
}
function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _retryBtn.addEventListener('click', retryQuiz);
}

document.addEventListener('DOMContentLoaded', function () {
    SendApiRequest();
    eventListeners()
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;

})
function useApiData(data) {
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    difficultOfQuestion = data.difficulty;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;

    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    _question.innerHTML = `${data.question}`
    _difficulty.innerHTML = `<p>Difficulty: ${data.difficulty}</p>`
    _type.innerHTML = `<p>Category: ${data.category}</p>`
    _options.innerHTML = `${optionsList.map((option, index) => `<button type="button" class="Answer"> ${index + 1 + ". "}&nbsp<span>${option}</span></button>`).join('')}`

    selectOption();
}
function selectOption() {
    _options.querySelectorAll('.Answer').forEach((option) => {
        option.addEventListener('click', function () {
            if (_options.querySelector('#selected')) {
                const activeOption = _options.querySelector('#selected');
                activeOption.removeAttribute('id');
            }
            option.setAttribute('id','selected');

        });
    });
}

function checkAnswer() {
    _checkBtn.disabled = true;
   btnColorEnable();
    if (_options.querySelector('#selected')) {
        let selectedAnswer = _options.querySelector('#selected span').textContent;
        if (selectedAnswer == HTMLDecode(correctAnswer)) {
            QuestionCorrect++;
            correctScore++;
            if(difficultOfQuestion == "hard"){
                PointScores += 100;
            } else if(difficultOfQuestion == "medium") {
                PointScores += 50;
            } else {
                PointScores += 25;
            }
            _result.innerHTML = `<p class="ResultsTextCorrect"> <i class = "fas fa-check"></i>correct answer! </p>`;
        } else {
            _result.innerHTML = `<p class="ResultsTextIncorrect"> <i class = "fas fa-check"></i> incorrect answer!<small><b> Correct Answer: </b> ${correctAnswer}</small> </p>`;
            correctScore++;
        }
        checkCount();
    } else {
           btnColorDisable();
        _result.innerHTML = `<p class="SelectionOptionAtencion"><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}
function checkCount() {
    askedCount++;
    setCount();
    if (askedCount == totalQuestion) {
        setTimeout(function () {
        }, 5000);
        _Points.innerHTML = `<div class="ScorePoints"><p class="QuestionCorrect">Your correct answers was ${QuestionCorrect}.</p></div> <div class="ScorePoints"> <p class="QuestionCorrect">Your point is ${PointScores}</p></div>`;
        _retryBtn.style.display = "block";
        _checkBtn.style.display = "none";
    } else {
        setTimeout(function () {
            btnColorDisable();
            SendApiRequest();
        }, 500);
    }
}

function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function retryQuiz() {
    correctScore = askedCount = 0;
    _correctScore.innerHTML = 0;
    PointScores = 0;
    QuestionCorrect = 0;
    btnColorDisable();
    _retryBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    SendApiRequest()
}
function btnColorEnable(){
    _checkBtn.style.background = "#660066";
    _checkBtn.style.color = "#ffffff";
}
function btnColorDisable(){
    _checkBtn.style.background = "";
    _checkBtn.style.color = "";
}