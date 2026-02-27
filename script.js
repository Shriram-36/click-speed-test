document.addEventListener('DOMContentLoaded', function () {

    const clickSound = document.getElementById("clickSound");

    const clickBtn = document.getElementById('actionBtn');
    const resetBtn = document.getElementById('resetBtn');
    const startBtn = document.getElementById('startBtn');

    const timeInput = document.getElementById('timeInput');
    const timeDisplay = document.getElementById('timeDisplay');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const cpsDisplay = document.getElementById('cpsDisplay');
    const highScoreDisplay = document.getElementById('highScore');
    const finalMessage = document.getElementById('finalMessage');
    const progressBar = document.getElementById('progressBar');

    let clickCount = 0;
    let timeLeft = 0;
    let timer;
    let gameTime = 0;

    let lastClickTime = 0;   // 🔥 Used to detect click speed

    let highScore = localStorage.getItem("highScore") || 0;
    highScoreDisplay.textContent = highScore;

    // ================= START GAME =================
    startBtn.addEventListener('click', function () {

        const userTime = parseInt(timeInput.value);

        if (!userTime || userTime <= 0) {
            alert("Enter valid time!");
            return;
        }

        clickCount = 0;
        gameTime = userTime;
        timeLeft = userTime;

        scoreDisplay.textContent = 0;
        cpsDisplay.textContent = 0;
        finalMessage.textContent = "";
        progressBar.style.width = "100%";

        clickBtn.disabled = false;

        timer = setInterval(() => {

            timeLeft--;
            timeDisplay.textContent = timeLeft;

            let percentage = (timeLeft / gameTime) * 100;
            progressBar.style.width = percentage + "%";

            // Progress color change
            if (percentage > 60) {
                progressBar.style.background = "linear-gradient(90deg, #00c853, #64dd17)";
            } 
            else if (percentage > 30) {
                progressBar.style.background = "linear-gradient(90deg, #ffd600, #ffab00)";
            } 
            else {
                progressBar.style.background = "linear-gradient(90deg, #d50000, #ff1744)";
            }

            if (timeLeft <= 0) {
                clearInterval(timer);
                clickBtn.disabled = true;

                let cps = (clickCount / gameTime).toFixed(2);
                cpsDisplay.textContent = cps;

                finalMessage.textContent = `🎉 Game Over! Final Score: ${clickCount}`;

                if (clickCount > highScore) {
                    highScore = clickCount;
                    localStorage.setItem("highScore", highScore);
                    highScoreDisplay.textContent = highScore;
                }
            }

        }, 1000);

        timeDisplay.textContent = timeLeft;
    });

    // ================= CLICK BUTTON =================
    clickBtn.addEventListener('click', function () {

        clickCount++;
        scoreDisplay.textContent = clickCount;

        // 🔥 Calculate click speed
        const now = Date.now();
        const timeDifference = now - lastClickTime;
        lastClickTime = now;

        // Change sound speed based on click speed
        if (timeDifference < 120) {
            clickSound.playbackRate = 2.0;  // Very fast clicking
        } 
        else if (timeDifference < 250) {
            clickSound.playbackRate = 1.5;  // Medium fast
        } 
        else {
            clickSound.playbackRate = 1.0;  // Normal speed
        }

        // Play sound
        clickSound.currentTime = 0;
        clickSound.play();

        // Shake animation
        clickBtn.classList.add("shake");
        setTimeout(() => {
            clickBtn.classList.remove("shake");
        }, 200);
    });

    // ================= RESET =================
    resetBtn.addEventListener('click', function () {

        clearInterval(timer);

        clickCount = 0;
        timeLeft = 0;

        scoreDisplay.textContent = 0;
        timeDisplay.textContent = 0;
        cpsDisplay.textContent = 0;
        finalMessage.textContent = "";

        progressBar.style.width = "100%";
        progressBar.style.background = "linear-gradient(90deg, #667eea, #764ba2)";

        clickBtn.disabled = true;
        timeInput.value = "";
    });

});