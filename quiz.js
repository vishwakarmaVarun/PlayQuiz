const questionElement = document.getElementById("questions");
const answersBtns = document.getElementById("answers-btns");
const nextBtn = document.getElementById("next-btn");
const loadingElement = document.getElementById("loading-state");

const categorySelect = document.getElementById("category-select");
const typeSelect = document.getElementById("type-select");
const difficultySelect = document.getElementById("difficulty-select");

let questions = [];
let currentQI = 0;
let score = 0;

async function fetchQuestions() {
    const category = categorySelect.value;
    const type = typeSelect.value;
    const difficulty = difficultySelect.value;

    try {
        let url = `https://opentdb.com/api.php?amount=10&type=${type}`;
        if (category !== 'any') {
            url += `&category=${category}`;
        }
        if (difficulty !== 'any') {
            url += `&difficulty=${difficulty}`;
        }
    
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching questions:", error);
        // Provide fallback data or error message
        return [
            {
                question: "Sorry, something went wrong. Please try again later.",
                correct_answer: "Unknown",
                incorrect_answers: ["Unknown"]
            }
        ];
    }
}

function startQuiz() {
    currentQI = 0;
    score = 0;
    nextBtn.innerHTML = "Next Question";
    nextBtn.style.display = "none";
    loadingElement.style.display = "block";
    loadNewQuestions();
}

function showQuestion(question) {
    resetState();
    loadingElement.style.display = "none";
    let currentQuestion = question.question;
    let questionNo = currentQI + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion;
    let correctAnswer = question.correct_answer;
    const answers = [...question.incorrect_answers, correctAnswer].sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer;
        button.classList.add("btn");
        answersBtns.appendChild(button);

        if (answer === correctAnswer) {
            button.dataset.correct = "true";
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextBtn.style.display = "none";
    while (answersBtns.firstChild) {
        answersBtns.removeChild(answersBtns.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answersBtns.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextBtn.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextBtn.innerHTML = "Play Again";
    nextBtn.style.display = "block";
}

function handleNextBtn() {
    currentQI++;
    if (currentQI < questions.length) {
        showQuestion(questions[currentQI]);
    } else {
        showScore();
    }
}

async function loadNewQuestions() {
    questions = await fetchQuestions();
    showQuestion(questions[currentQI]);
}

nextBtn.addEventListener("click", () => {
    if (currentQI < questions.length) {
        handleNextBtn();
    } else {
        startQuiz();
    }
});

categorySelect.addEventListener("change", startQuiz);
typeSelect.addEventListener("change", startQuiz);
difficultySelect.addEventListener("change", startQuiz);

startQuiz();
