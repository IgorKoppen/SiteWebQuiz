let _question = document.getElementById('question');
let _options = document.querySelector('.Questions');
let _difficulty = document.getElementById('difficult');
let _type = document.getElementById('category');
let _correctScore = document.getElementById('CountQuestion');
let _totalQuestion = document.getElementById('totalQuestion');
let _checkAnswer = document.querySelectorAll('.Answer');
let _result = document.getElementById('Results');
let _Points = document.getElementById('PointsShow')
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
let _VisualizeScore = document.getElementById('VisualizeScore');
let _seconds = document.getElementById('seconds');
let _ss = document.getElementById('ss');
let _TableContent = document.querySelector('.AllCountent');
let _sec_dot = document.querySelector('.Sec_dot');
let correctScore = askedCount = 0, totalQuestion = 10, QuestionCorrect = 0, difficultOfQuestion = "", PointScores = 0, ScoreStrick = 0;
var seconds = 60;

async function SendApiRequest() {
    let response;
    try{
    if (_RdbMixed.checked == true) {
        response = await fetch('https://opentdb.com/api.php?amount=1');
    } else if (_RdbEasy.checked == true) {
        response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=easy');
    } else if (_RdbMedium.checked == true) {
        response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=medium');
    } else {
        response = await fetch('https://opentdb.com/api.php?amount=1&difficulty=hard');
    }
    let data = await response.json();
    _result.innerHTML = "";
    useApiData(data.results[0]);
} catch(err){
    SendApiRequest();
}
}
function eventListeners() {
    _retryBtn.addEventListener('click', retryQuiz);
    _BtnStart.addEventListener('click', StartTheGame);
    _BackToMenu.addEventListener('click', BackToMainMenu);
}
document.addEventListener('DOMContentLoaded', function () {
    eventListeners()
    _correctScore.textContent = correctScore;
})

async function StartTheGame() {
    if (_RdbShort.checked == true) {
        totalQuestion = 10;
        _totalQuestion.textContent = 10;
    } else if (_RdbModerate.checked == true) {
        totalQuestion = 20;
        _totalQuestion.textContent = 20;
    } else {
        totalQuestion = 30
        _totalQuestion.textContent = 30;
    }
    await SendApiRequest();
          animationStart();
}
function useApiData(data) {
    animationQuizFadeout();
    let correctAnswer = "";
    _options.disabled = false;
    correctAnswer = data.correct_answer;
    difficultOfQuestion = data.difficulty;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    _question.innerHTML = `${data.question}`
    _difficulty.innerHTML = `<p>Difficulty: ${data.difficulty}</p>`
    _type.innerHTML = `<p>Category: ${data.category}</p>`
    _options.innerHTML = `${optionsList.map((option, index) => `<button type="button" class="Answer"> ${index + 1 + ". "}&nbsp<span>${option}</span></button>`).join('')}`
    _VisualizeScore.innerHTML = `<h2>Points: ${PointScores} </h2>`
    animationQuizFadein();
    StartTimer(correctAnswer);
    selectOption(correctAnswer);
    
}
function selectOption(correctAnswer) {
    _options.querySelectorAll('.Answer').forEach((option) => {
        option.addEventListener('click', function () {
            if (_options.querySelector('#selected')) {
                const activeOption = _options.querySelector('#selected');
                activeOption.removeAttribute('id');
            }
            option.setAttribute('id', 'selected');
            checkAnswer(correctAnswer);
        });
    });
}
function checkAnswer(correctAnswer) {
    disabledOption();
    StopTimer();
    if (_options.querySelector('#selected')) {
        let selectedAnswer = _options.querySelector('#selected span').textContent;
        if (selectedAnswer == HTMLDecode(correctAnswer)) {
            QuestionCorrect++;
            _result.innerHTML = `<p class="ResultsTextCorrect"> <i class = "fas fa-check"></i>correct answer! </p>`;
            correctScore++;
            ScoreStrickCount();
            PointCalculate();
        } else {
            _QuizTable.classList.remove('Onfire');
            _result.innerHTML = `<p class="ResultsTextIncorrect"> <i class = "fas fa-check"></i> incorrect answer!<small><b> Correct Answer: </b> ${correctAnswer}</small> </p>`;
            correctScore++;
            ScoreStrick = 0;
        }
        checkCount();
    } else {
        _QuizTable.classList.remove('Onfire');
        _result.innerHTML = `<p class="ResultsTextIncorrect"> <i class = "fas fa-check"></i> incorrect answer!<small><b> Correct Answer: </b> ${correctAnswer}</small> </p>`;
        correctScore++;
        ScoreStrick = 0;
    }

}
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}
function checkCount() {
    askedCount++;
    if (askedCount == totalQuestion) {
        setTimeout(function () {
            StopTimer();
            _Points.innerHTML = `<div class="ScorePoints"><p class="QuestionCorrect">Your correct answers were ${QuestionCorrect}.</p></div> <div class="ScorePoints"> <p class="QuestionCorrect">Your point is ${PointScores}</p></div>`;
            animationRetryFadein();
            setCount();
        }, 400);

    } else {
        setTimeout(function () {
            StopTimer();
            seconds = 60;
            animationQuizFadeout();
            setTimeout(function () {
               SendApiRequest();
               setTimeout(function () {
               setCount();
            }, 400)
            }, 1000)
        }, 800);
    }
}
function setCount() {
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
}

function retryQuiz() {
    animationRetryFadeout();
    animationQuizFadeout();
    setTimeout(() => {
        Reset();
        SendApiRequest();
    }, 800);
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
    animationBackToMenu();
    setTimeout(() => {
        Reset();
    }, 400);
}
function Reset() {
    EnableOption();
    seconds = 60;
    correctScore = askedCount = 0;
    _correctScore.innerHTML = 0;
    _Points.innerHTML = "";
    PointScores = 0;
    QuestionCorrect = 0;
    ScoreStrick = 0;

}
function disabledOption() {
    _options.querySelectorAll('.Answer').forEach((option) => {
        option.disabled = true;
    });
}
function EnableOption() {
    _options.querySelectorAll('.Answer').forEach((option) => {
        option.disabled = false;
    });
}
function StartTimer(correctAnswer) {
    _seconds.innerHTML = seconds;
    _sec_dot.style.transform = `rotate(${seconds * 6}deg)`;
    _ss.style.strokeDashoffset = 440 - (430 * seconds) / 60;

    timer = setInterval(() => {
        if (seconds == 1) {
            StopTimer();
            checkAnswer(correctAnswer);
            checkCount();
        }
        seconds--;
        _sec_dot.style.transform = `rotate(${seconds * 6}deg)`;
        _ss.style.strokeDashoffset = 440 - (430 * seconds) / 60;
        _seconds.innerHTML = seconds;

    }, 1000)
}
function StopTimer() {
    clearInterval(timer);
}
async function animationStart() {
    setTimeout(function () {
        _RuleTable.classList.remove('shows');
        setTimeout(function () {
            _QuizTable.style.display = "block";
            _RuleTable.style.display = "none";
                setTimeout(function () {
                    _QuizTable.classList.add('shows');
                }, 400);
        },300);
}, 400);
}
function animationBackToMenu() {
    setTimeout(function () {
        _QuizTable.classList.remove('shows');
        setTimeout(function () {
            _RuleTable.style.display = "block";
            _QuizTable.style.display = "none";
                setTimeout(function () {
                    _RuleTable.classList.add('shows');
                }, 400);
        },300);
}, 400);
}
function animationRetryFadeout() {
    setTimeout(function () {
        _retryBtn.style.animation = "fadeout 0.3s";
        _BackToMenu.style.animation = "fadeout 0.3s";
        setTimeout(function () {
            _retryBtn.style.display = "none";
            _BackToMenu.style.display = "none";
        }, 300);
    }, 300);
}
function animationRetryFadein() {
    setTimeout(function () {
        _retryBtn.style.animation = "fadein 0.3s";
        _BackToMenu.style.animation = "fadein 0.3s";
        setTimeout(function () {
            _retryBtn.style.display = "block";
            _BackToMenu.style.display = "block";
        }, 300);
    }, 300);
}
function animationQuizFadein(){  
        setTimeout(function () {
            _TableContent.classList.add('shows');
        }, 700);
    }
    function  animationQuizFadeout(){

        setTimeout(function () {
            _TableContent.classList.remove('shows');
        }, 700);
    }