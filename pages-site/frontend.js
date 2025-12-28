/* ================= ELEMENTS ================= */
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const rawTextArea = document.getElementById("rawText");
const correctedTextArea = document.getElementById("correctedText");

const loadHistoryBtn = document.getElementById("loadHistoryBtn");
const historyList = document.getElementById("historyList");
const toggleHistoryBtn = document.getElementById("toggleHistoryBtn");
const historyContent = document.getElementById("historyContent");

const downloadTxtBtn = document.getElementById("downloadTxtBtn");
const exportTxtBtn = document.getElementById("exportTxtBtn");
const exportJsonBtn = document.getElementById("exportJsonBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");

const toneSelect = document.getElementById("toneSelect");
const latencyDisplay = document.getElementById("latencyDisplay");

const wordCountEl = document.getElementById("wordCount");
const timeElapsedEl = document.getElementById("timeElapsed");
const wpmEl = document.getElementById("wpm");
const clarityLevelEl = document.getElementById("clarityLevel");

const API_BASE_URL = "http://localhost:5000";

let recognition;
let finalTranscript = "";
let startTime = null;
let timerInterval = null;

/* ================= SPEECH ================= */
function supportsSpeechRecognition() {
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
}

function getSpeechRecognition() {
  return window.SpeechRecognition
    ? new window.SpeechRecognition()
    : new window.webkitSpeechRecognition();
}

/* ================= INSIGHTS ================= */
function startInsightsTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeElapsedEl.textContent = `${elapsed}s`;

    const words = finalTranscript.trim()
      ? finalTranscript.trim().split(/\s+/).length
      : 0;

    wordCountEl.textContent = words;
    const wpm = elapsed > 0 ? Math.round(words / (elapsed / 60)) : 0;
    wpmEl.textContent = `${wpm} WPM`;

    clarityLevelEl.textContent =
      words > 20 && wpm >= 90 && wpm <= 160 ? "High" :
      words > 10 ? "Medium" : "Low";
  }, 1000);
}

function stopInsightsTimer() {
  clearInterval(timerInterval);
}

/* ================= RECORD ================= */
function startRecording() {
  if (!supportsSpeechRecognition()) return alert("Speech not supported");

  recognition = getSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  finalTranscript = "";
  rawTextArea.value = "";
  correctedTextArea.value = "";

  startInsightsTimer();

  recognition.onresult = async (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
        rawTextArea.value = finalTranscript;
        await sendRawText(finalTranscript);
      }
    }
  };

  recognition.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
}

function stopRecording() {
  recognition?.stop();
  stopInsightsTimer();
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

/* ================= API ================= */
async function sendRawText(rawText) {
  const response = await fetch(`${API_BASE_URL}/transcriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText, tone: toneSelect.value })
  });

  const data = await response.json();
  correctedTextArea.value = data.cleanedText;
  latencyDisplay.textContent = `⚡ Processing time: ${data.latencyMs} ms`;
}

/* ================= HISTORY ================= */
async function loadHistory() {
  historyList.innerHTML = "";
  const res = await fetch(`${API_BASE_URL}/transcriptions`);
  const data = await res.json();

  data.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.cleanedText}</strong><br>
      <small>${new Date(item.createdAt).toLocaleString()}</small>
    `;
    historyList.appendChild(li);
  });
}

/* ================= EXPORT ================= */
function downloadAsTxt() {
  const blob = new Blob([correctedTextArea.value], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "transcription.txt";
  a.click();
}

/* ================= LISTENERS ================= */
startBtn.onclick = startRecording;
stopBtn.onclick = stopRecording;
loadHistoryBtn.onclick = loadHistory;
toggleHistoryBtn.onclick = () =>
  historyContent.style.display =
    historyContent.style.display === "none" ? "block" : "none";
downloadTxtBtn.onclick = downloadAsTxt;
exportTxtBtn.onclick = loadHistory;
exportJsonBtn.onclick = loadHistory;
exportPdfBtn.onclick = loadHistory;
