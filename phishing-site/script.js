// 倒計時功能（設定為5分鐘）
let totalSeconds = 5 * 60; // 5分鐘

function updateCountdown() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0"
  );
  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0"
  );

  if (totalSeconds > 0) {
    totalSeconds--;
  } else {
    // 時間到後重新設定
    totalSeconds = 5 * 60;
  }
}

// 每秒更新一次
setInterval(updateCountdown, 1000);
updateCountdown(); // 立即執行一次
