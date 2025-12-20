import { useState } from "react";
import axios from "axios";

interface UserProfile {
  userId: number;
  username: string;
}

export default function Dashboard() {
  const [token] = useState<string | null>(() => {
    return localStorage.getItem("access_token");
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState(5000);
  const [transferAmount, setTransferAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    try {
      const response = await axios.get("http://localhost:3000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferAmount || !recipient) {
      setMessage("Please fill in all fields");
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount > balance) {
      setMessage("Insufficient balance!");
      return;
    }

    if (amount <= 0) {
      setMessage("Amount must be greater than 0");
      return;
    }

    try {
      setBalance(balance - amount);
      setMessage(`✅ Successfully transferred $${amount} to ${recipient}`);
      setTransferAmount("");
      setRecipient("");
    } catch (error) {
      console.error(error);
      setMessage("Transfer failed!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>💰 SecureBank Dashboard</h1>
        <p style={styles.tagline}>Your Safe Banking Solution</p>
      </div>

      {token ? (
        <div style={styles.content}>
          {/* Account Info Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Account Information</h2>
            {profile ? (
              <div style={styles.accountInfo}>
                <p>
                  <strong>Username:</strong> {profile.username}
                </p>
                <p>
                  <strong>Account ID:</strong> {profile.userId}
                </p>
              </div>
            ) : (
              <button onClick={loadProfile} style={styles.button}>
                Load Profile
              </button>
            )}
          </div>

          {/* Balance Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Account Balance</h2>
            <div style={styles.balance}>
              <p style={styles.balanceAmount}>${balance.toFixed(2)}</p>
              <p style={styles.balanceLabel}>Available Balance</p>
            </div>
          </div>

          {/* Transfer Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>💸 Transfer Money</h2>
            <form onSubmit={handleTransfer} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Recipient Name:</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter recipient name"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Amount (USD):</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  style={styles.input}
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                Transfer Money
              </button>
            </form>

            {message && (
              <p
                style={{
                  ...styles.message,
                  color: message.includes("✅") ? "green" : "red",
                }}
              >
                {message}
              </p>
            )}
          </div>

          {/* Security Warning Card */}
          <div style={styles.warningCard}>
            <h3>⚠️ Security Warning</h3>
            <p>
              Never share your login credentials or token with anyone. Beware of
              phishing emails and suspicious links.
            </p>
          </div>

          {/* Token Display (for demonstration) */}
          <div style={styles.tokenCard}>
            <p style={styles.tokenLabel}>
              Your Session Token (for lab purposes):
            </p>
            <code style={styles.tokenCode}>{token.substring(0, 50)}...</code>
          </div>
        </div>
      ) : (
        <div style={styles.notLoggedIn}>
          <p>Please log in to access your account.</p>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#1e3a8a",
    color: "white",
    borderRadius: "10px",
  },
  tagline: {
    margin: "10px 0 0 0",
    fontSize: "14px",
    opacity: 0.9,
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  cardTitle: {
    margin: "0 0 15px 0",
    color: "#1e3a8a",
    fontSize: "18px",
  },
  accountInfo: {
    textAlign: "left",
    lineHeight: "1.8",
  },
  balance: {
    textAlign: "center",
    padding: "20px 0",
  },
  balanceAmount: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#16a34a",
    margin: "0",
  },
  balanceLabel: {
    color: "#666",
    margin: "5px 0 0 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#0275d8",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },
  message: {
    marginTop: "15px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#f0f0f0",
  },
  warningCard: {
    backgroundColor: "#fff3cd",
    border: "1px solid #ffc107",
    padding: "15px",
    borderRadius: "10px",
    gridColumn: "1 / -1",
  },
  tokenCard: {
    backgroundColor: "#f8f9fa",
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    gridColumn: "1 / -1",
  },
  tokenLabel: {
    fontSize: "12px",
    color: "#666",
    margin: "0 0 10px 0",
  },
  tokenCode: {
    display: "block",
    padding: "10px",
    backgroundColor: "#e9ecef",
    borderRadius: "5px",
    overflow: "auto",
    fontSize: "12px",
  },
  notLoggedIn: {
    textAlign: "center",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "10px",
  },
};
