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
let _selectedAnswer = document.getElementsByClassName('selected');
let _QuizTable = document.querySelector('.QuizTable');
let _BtnStart = document.getElementById('Start');
let _RuleTable = document.querySelector('.QuizStart');
let _BackToMenu = document.getElementById('BtnBackToMenu')
let _RdbShort = document.getElementById('Short');
let _RdbModerate = document.getElementById('Moderate');
let _RdbLong = document.getElementById('Long');
let _RdbMixed = document.getElementById('Mixed');
let _RdbEasy = document.getElementById('Easy');
let _RdbMedium = document.getElementById('Medium');
let _RdbHard = document.getElementById('Hard');
let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10, QuestionCorrect = 0, difficultOfQuestion = "", PointScores = 0, ScoreStrick = 0;

async function SendApiRequest() {
    let response;
    if(_RdbMixed.checked == true){
     response = await fetch('https://opentdb.com/api.php?amount=1');
    } else if(_RdbEasy.checked == true){
      response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=easy');
    } else if(_RdbMedium.checked == true){
      response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=medium');
    } else{
      response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=hard');
    }
    let data = await response.json();
    _result.innerHTML = "";
    useApiData(data.results[0]);
}
function eventListeners() {
    _checkBtn.addEventListener('click', checkAnswer);
    _retryBtn.addEventListener('click', retryQuiz);
    _BtnStart.addEventListener('click', StartTheGame);
    _BackToMenu.addEventListener('click', BackToMainMenu);
}
document.addEventListener('DOMContentLoaded', function () {
    eventListeners()
    _correctScore.textContent = correctScore;
})
function StartTheGame() {
    if(_RdbShort.checked == true){
        totalQuestion = 10;
        _totalQuestion.textContent = 10;
    } else if(_RdbModerate.checked == true){
        totalQuestion = 20;
        _totalQuestion.textContent = 20;
    }else{
        totalQuestion = 30
        _totalQuestion.textContent = 30;
    }
    SendApiRequest();
    setTimeout(function () {
        _RuleTable.style.display = "none";
        _QuizTable.style.display = "block";
    }, 500);
}
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
            option.setAttribute('id', 'selected');
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
            ScoreStrickCount();
            PointCalculate();
            _result.innerHTML = `<p class="ResultsTextCorrect"> <i class = "fas fa-check"></i>correct answer! </p>`;
        } else {
            _QuizTable.classList.remove('Onfire');
            _result.innerHTML = `<p class="ResultsTextIncorrect"> <i class = "fas fa-check"></i> incorrect answer!<small><b> Correct Answer: </b> ${correctAnswer}</small> </p>`;
            correctScore++;
            ScoreStrick = 0;
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
        _Points.innerHTML = `<div class="ScorePoints"><p class="QuestionCorrect">Your corrects answers was ${QuestionCorrect}.</p></div> <div class="ScorePoints"> <p class="QuestionCorrect">Your point is ${PointScores}</p></div>`;
        _retryBtn.style.display = "block";
        _BackToMenu.style.display = "block";
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
    Reset();
    btnColorDisable();
    SendApiRequest();
}
function PointCalculate() {
    if (difficultOfQuestion == "hard") {
        PointScores += 100;
    } else if (difficultOfQuestion == "medium") {
        PointScores += 50;
    } else {
        PointScores += 25;
    }
}
function ScoreStrickCount() {
    ScoreStrick++;
    if (ScoreStrick > 2) {
        _QuizTable.classList.add('Onfire');
        PointScores += 20;
    }
}
function BackToMainMenu() {
    Reset();
    _RuleTable.style.display = "block";
    _QuizTable.style.display = "none";
}
function btnColorEnable() {
    _checkBtn.style.background = "#660066";
    _checkBtn.style.color = "#ffffff";
}
function btnColorDisable() {
    _checkBtn.style.background = "#eabfff";
    _checkBtn.style.color = "#000000";
}
function Reset() {
    correctScore = askedCount = 0;
    _correctScore.innerHTML = 0;
    _Points.innerHTML = "";
    PointScores = 0;
    QuestionCorrect = 0;
    ScoreStrick = 0;
    _retryBtn.style.display = "none";
    _BackToMenu.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
}
try {
    if (typeof(window.console) != "undefined") {
        window.console = {};
        window.console.log = function () {
        };
    }
    if (typeof(alert) !== "undefined") {
        alert = function ()
        {
        }
    }

} catch (ex) {
}