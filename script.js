let intervalId = null;
const maxNum = 75;
let history = [];
let historyIndex = -1;
let isRunning = false;

const resultElement = document.getElementById("result");
const displayElement = document.getElementById("display");
const previousElement = document.getElementById("previous");

const drumAudio = new Audio("./audio/drum.mp3");
const symAudio = new Audio("./audio/sym.mp3");

// 番号を生成
const generateBingoNumber = () => {
	let number;
	do {
		number = Math.floor(Math.random() * maxNum) + 1;
	} while (history.includes(number.toString()));
	return number;
};

// resultを更新
const updateResultDisplay = () => {
	const numberSpans = resultElement.getElementsByClassName("number");
	for (let span of numberSpans) {
		span.classList.toggle(
			"hit",
			history.slice(0, historyIndex + 1).includes(span.textContent)
		);
	}
};

// 履歴を表示
const showHistory = (index) => {
	if (index >= 0 && index < history.length) {
		displayElement.textContent = history[index];
		previousElement.textContent = index > 0 ? history[index - 1] : "-";
	} else if (index === -1) {
		displayElement.textContent = "-";
		previousElement.textContent = "-";
	}
	updateResultDisplay();
};

// リセット
const resetBingo = () => {
	history = [];
	historyIndex = -1;
	displayElement.textContent = "-";
	previousElement.textContent = "-";
	displayElement.className = "";
	const numberSpans = resultElement.getElementsByClassName("number");
	for (let span of numberSpans) {
		span.classList.remove("hit");
	}
	isRunning = false;
	clearInterval(intervalId);
	drumAudio.pause();
	drumAudio.currentTime = 0;
};

// 開始/停止
const toggleBingo = () => {
	if (history.length === maxNum) {
		return;
	}
	isRunning = !isRunning;
	if (isRunning) {
		displayElement.classList.remove("stopped");
		drumAudio.loop = true;
		drumAudio.currentTime = 0;
		drumAudio.play();
		intervalId = setInterval(() => {
			displayElement.textContent = generateBingoNumber();
		}, 50);
	} else {
		displayElement.classList.add("stopped");
		drumAudio.pause();
		drumAudio.currentTime = 0;
		symAudio.currentTime = 0;
		symAudio.play();
		clearInterval(intervalId);
		intervalId = null;
		const currentNumber = displayElement.textContent;

		displayElement.textContent = currentNumber;
		symAudio.currentTime = 0;
		symAudio.play();

		if (historyIndex < history.length - 1) {
			history = history.slice(0, historyIndex + 1);
		}
		history.push(currentNumber);
		historyIndex = history.length - 1;
		previousElement.textContent =
			history.length > 1 ? history[history.length - 2] : "-";
		const numberSpans = resultElement.getElementsByClassName("number");
		for (let span of numberSpans) {
			if (span.textContent === currentNumber) {
				span.classList.add("hit");
			}
		}
		if (history.length === maxNum) {
			isRunning = false;
			drumAudio.pause();
			drumAudio.currentTime = 0;
		}
	}
};

// resultを生成
for (let i = 1; i <= maxNum; i++) {
	const span = document.createElement("span");
	span.textContent = i;
	span.classList.add("number");
	resultElement.appendChild(span);
}

// キーボードイベントリスナー
document.addEventListener("keydown", (event) => {
	if (event.code === "Space") {
		event.preventDefault();
		toggleBingo();
	} else if (event.code === "KeyZ") {
		event.preventDefault();
		if (historyIndex >= 0) {
			historyIndex--;
			showHistory(historyIndex);
		}
	} else if (event.code === "KeyY") {
		event.preventDefault();
		if (historyIndex < history.length - 1) {
			historyIndex++;
			showHistory(historyIndex);
		}
	} else if (event.code === "KeyR") {
		event.preventDefault();
		resetBingo();
	}
});
