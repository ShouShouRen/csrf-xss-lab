/**
 * 檢查 JWT token 是否過期
 * @param token JWT token 字串
 * @returns true 如果 token 有效且未過期，false 如果 token 無效或已過期
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }

  try {
    // JWT token 格式：header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid token format: token does not have 3 parts');
      return false;
    }

    // 解碼 payload（base64url）
    const payload = parts[1];
    // 將 base64url 轉換為 base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // 補齊 padding
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    // 解碼
    const decoded = atob(padded);
    const payloadObj = JSON.parse(decoded);

    // 檢查是否有 exp（過期時間）欄位
    if (!payloadObj.exp) {
      console.warn('Token does not have expiration time (exp)');
      return false;
    }

    // exp 是 Unix timestamp（秒），轉換為毫秒與當前時間比較
    const expirationTime = payloadObj.exp * 1000;
    const currentTime = Date.now();

    // 如果當前時間小於過期時間，token 仍然有效
    const isValid = currentTime < expirationTime;
    
    if (!isValid) {
      console.warn('Token has expired', {
        expirationTime: new Date(expirationTime).toISOString(),
        currentTime: new Date(currentTime).toISOString()
      });
    }
    
    return isValid;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

/**
 * 清除過期的 token
 */
export function clearExpiredToken(): void {
  const token = localStorage.getItem('access_token');
  if (token && !isTokenValid(token)) {
    localStorage.removeItem('access_token');
  }
}

