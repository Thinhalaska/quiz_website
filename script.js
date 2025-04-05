// Danh sách câu hỏi
const questions = [
    {
        question: "HTML là viết tắt của gì?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "Hyperlinks and Text Markup Language", correct: false },
            { text: "Home Tool Markup Language", correct: false },
            { text: "Hyper Tool Markup Language", correct: false }
        ]
    },
    {
        question: "CSS là viết tắt của gì?",
        answers: [
            { text: "Computer Style Sheets", correct: false },
            { text: "Creative Style Sheets", correct: false },
            { text: "Cascading Style Sheets", correct: true },
            { text: "Colorful Style Sheets", correct: false }
        ]
    },
    {
        question: "JavaScript là ngôn ngữ gì?",
        answers: [
            { text: "Ngôn ngữ biên dịch", correct: false },
            { text: "Ngôn ngữ đánh dấu", correct: false },
            { text: "Ngôn ngữ thông dịch", correct: true },
            { text: "Ngôn ngữ máy", correct: false }
        ]
    },
    {
        question: "Phần tử nào trong HTML được dùng để chèn JavaScript?",
        answers: [
            { text: "<script>", correct: true },
            { text: "<javascript>", correct: false },
            { text: "<js>", correct: false },
            { text: "<scripting>", correct: false }
        ]
    },
    {
        question: "Thuộc tính CSS nào dùng để thay đổi màu chữ?",
        answers: [
            { text: "text-color", correct: false },
            { text: "fgcolor", correct: false },
            { text: "color", correct: true },
            { text: "font-color", correct: false }
        ]
    }
];

// Các phần tử DOM
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultsElement = document.getElementById('results');
const scoreTextElement = document.getElementById('score-text');
const percentageElement = document.getElementById('percentage');
const correctElement = document.getElementById('correct');
const totalElement = document.getElementById('total');
const restartButton = document.getElementById('restart-btn');
const timerElement = document.getElementById('time');

// Biến toàn cục
let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timer;
let timeLeft = 600; // 10 phút = 600 giây

// Sự kiện bắt đầu
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
submitButton.addEventListener('click', showResults);
restartButton.addEventListener('click', restartQuiz);

// Bắt đầu bài kiểm tra
function startQuiz() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
    startTimer();
}

// Bắt đầu đếm ngược thời gian
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResults();
        }
    }, 1000);
}

// Cập nhật đồng hồ đếm ngược
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Hiển thị câu hỏi tiếp theo
function setNextQuestion() {
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// Hiển thị câu hỏi
function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
    
    // Ẩn nút "Tiếp theo" nếu là câu hỏi cuối cùng
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
        submitButton.classList.add('hide');
    } else {
        nextButton.classList.add('hide');
        submitButton.classList.remove('hide');
    }
}

// Reset trạng thái câu hỏi
function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

// Xử lý khi chọn đáp án
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    
    // Tô màu đáp án đúng/sai
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    
    // Tăng điểm nếu đúng
    if (correct) {
        score++;
    }
    
    // Vô hiệu hóa các nút sau khi chọn
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
    });
    
    // Hiển thị nút tiếp theo hoặc nút nộp bài
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        submitButton.classList.remove('hide');
    }
}

// Đặt lớp CSS cho đáp án đúng/sai
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('incorrect');
    }
}

// Xóa lớp CSS đáp án
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('incorrect');
}

// Hiển thị kết quả
function showResults() {
    clearInterval(timer);
    questionContainerElement.classList.add('hide');
    resultsElement.classList.remove('hide');
    
    const percentage = Math.round((score / questions.length) * 100);
    
    correctElement.innerText = score;
    totalElement.innerText = questions.length;
    percentageElement.innerText = `Tỉ lệ đúng: ${percentage}%`;
}

// Làm lại bài kiểm tra
function restartQuiz() {
    resultsElement.classList.add('hide');
    startButton.classList.remove('hide');
    timeLeft = 600;
    timerElement.textContent = '10:00';
}