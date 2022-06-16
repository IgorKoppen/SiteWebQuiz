let _question = document.getElementById('question');
let _options = document.querySelector('.Questions');
let _difficulty = document.getElementById('difficult');
let _type = document.getElementById('category');
let _correctScore = document.getElementById('CountQuestion')
let _totalQuestion = document.getElementById('totalQuestion')
let _checkAnswer = document.querySelectorAll('.Answer')
let _result = document.getElementById('Results')
let _checkBtn = document.getElementById('BtnCheck');
let _retryBtn = document.getElementById('Btnretry');
let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10, QuestionCorrect = 0;



async function SendApiRequest(){
    let response = await fetch('https://opentdb.com/api.php?amount=1');
    let data = await response.json();
    _result.innerHTML = "";
     useApiData(data.results[0]);
}
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _retryBtn.addEventListener('click', retryQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    SendApiRequest();
    eventListeners()
    _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
    
})
function useApiData(data){
    _checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;

     optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
     _question.innerHTML = `${data.question}`
     _difficulty.innerHTML = `<p>Difficulty: ${data.difficulty}</p>`
     _type.innerHTML = `<p>Category: ${data.category}</p>`
     _options.innerHTML = `${optionsList.map((option, index) => `<button type="button" class="Answer"> ${index + 1 +". "}&nbsp<span>${option}</span></button>`).join('')}`

     selectOption();
    }
function selectOption(){
    _options.querySelectorAll('.Answer').forEach((option) =>{
        option.addEventListener('click', function(){
           if(_options.querySelector('.selected')){
            const activeOption = _options.querySelector('.selected');
            activeOption.classList.remove('selected');
           }
          option.classList.add('selected');
         
      });
     });
}

function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            QuestionCorrect++;
            correctScore++;
            _result.innerHTML = `<p class="ResultsTextCorrect"> <i class = "fas fa-check"></i>correct answer! </p>`;
        } else {
                _result.innerHTML = `<p class="ResultsTextIncorrect"> <i class = "fas fa-check"></i> incorrect answer!<small><b> Correct Answer: </b> ${correctAnswer}</small> </p>`;
                correctScore++;
            }
            checkCount();
        } else {
            _result.innerHTML = `<p class="SelectionOptionAtencion"><i class = "fas fa-question"></i>Please select an option!</p>`;
            _checkBtn.disabled = false;
        }
    }

    function HTMLDecode(textString) {
        let doc = new DOMParser().parseFromString(textString, "text/html");
        return doc.documentElement.textContent;
    }
    function checkCount(){
        askedCount++;
        setCount();
        if(askedCount == totalQuestion){
            setTimeout(function(){
                console.log("");
            }, 5000);
    
    
            _result.innerHTML += `<p class="QuestionCorrect">Your score is ${QuestionCorrect}.</p>`;
            _retryBtn.style.display = "block";
            _checkBtn.style.display = "none";
        } else {
            setTimeout(function(){
                SendApiRequest();
            }, 500);
        }
    }
    
    function setCount(){
        _totalQuestion.textContent = totalQuestion;
        _correctScore.textContent = correctScore;
    }
    
    function retryQuiz(){
        correctScore = askedCount = 0;
        QuestionCorrect = 0;
        _retryBtn.style.display = "none";
        _checkBtn.style.display = "block";
        _checkBtn.disabled = false;
        SendApiRequest()
    }