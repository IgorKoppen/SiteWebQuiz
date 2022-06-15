window.onload = SendApiRequest
async function SendApiRequest(){
    let response = await fetch('https://opentdb.com/api.php?amount=10');
    console.log(response)
    let data = await response.json()
    console.log(data)
    useApiData(data)
}
function useApiData(data){
    document.querySelector("#category").innerHTML = `Category: ${data.results[0].category}`
    document.querySelector("#difficult").innerHTML = `Difficulty: ${data.results[0].difficulty}`
    document.querySelector("#question").innerHTML = `${data.results[0].question}`
    document.querySelector("#answer1").innerHTML = data.results[0].correct_answer
    document.querySelector("#answer2").innerHTML = data.results[0].incorrect_answers[0]
    document.querySelector("#answer3").innerHTML = data.results[0].incorrect_answers[1]
    document.querySelector("#answer4").innerHTML = data.results[0].incorrect_answers[2]
}
var correctButton = document.querySelector("#answer1")
var incorrectButton = document.querySelectorAll(".Questionwrong")
var score = document.querySelector("#Score")
var scoreResult = 0;
console.log(incorrectButton)
correctButton.addEventListener("click", ()=>{
alert("Correct!")
scoreResult = scoreResult + 1;
score.innerHTML = scoreResult;
SendApiRequest()
})
for (i = 0; i < incorrectButton.length; i++) {
  incorrectButton[i].addEventListener('click',wrongQuestionResult);
    
}

function wrongQuestionResult(e){
    alert("Incorrect!");
    SendApiRequest();
}