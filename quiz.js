const questions = [
    {
        question: "Which is the largest animal in the world?",
        answers: [
            {text: "Shark", correct: "false"},
            {text: "Blue Whale", correct: "true"},
            {text: "Elephant", correct: "false"},
            {text: "Giraffe", correct: "false"}
        ]
    },
    {
        question: "Which is the smallest country in the world?",
        answers: [
            {text: "Sri Lanka", correct: "false"},
            {text: "Nepal", correct: "false"},
            {text: "Bhutan", correct: "true"},
            {text: "Vatican City", correct: "false"}
        ]
    },
    {
        question: "Which is the smallest continent in the world?",
        answers: [
            {text: "Australia", correct: "true"},
            {text: "Asia", correct: "false"},
            {text: "Arctic", correct: "false"},
            {text: "Africa", correct: "false"}
        ]
    },
    {
        question: "Who is the Prime Minister of India?",
        answers: [
            {text: "Rahul Gandhi", correct: "false"},
            {text: "Indira Gandhi", correct: "false"},
            {text: "Mahendra Singh Dhoni", correct: "false"},
            {text: "Narendra Modi", correct: "true"}
        ]
    },
    {
        question: "What is the output of addition of these two numbers 10 and 10?",
        answers: [
            {text: "1010", correct: "false"},
            {text: "30", correct: "false"},
            {text: "20", correct: "true"},
            {text: "11", correct: "false"}
        ]
    }
];

const questionElement = document.getElementById("questions");
const answersBtns = document.getElementById("answers-btns");
const nextBtn = document.getElementById("next-btn");

let currentQI = 0;
let score = 0;

function StartQuiz(){
    currentQI = 0;
    score = 0;
    nextBtn.innerHTML = "Next";
    ShowQuestion();
}

function ShowQuestion(){
    resetState();
    let currentQuestion = questions[currentQI];
    let questinNo = currentQI + 1;
    questionElement.innerHTML = questinNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answersBtns.appendChild(button);

        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    })
}

function resetState(){
    nextBtn.style.display = "none";
    while(answersBtns.firstChild){
        answersBtns.removeChild(answersBtns.firstChild);
    }
}

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }
    else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answersBtns.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextBtn.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextBtn.innerHTML = "Play Again";
    nextBtn.style.margin = "20px 0 0";
    nextBtn.style.display = "block"
}

function handleNextBtn(){
    currentQI++;
    if(currentQI < questions.length){
        ShowQuestion();
    }
    else{
        showScore();
    }
}

nextBtn.addEventListener("click", () => {
    if(currentQI < questions.length){
        handleNextBtn();
    }else{
        StartQuiz();
    }
})

StartQuiz();