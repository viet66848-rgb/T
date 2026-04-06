const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Key hợp lệ duy nhất là "1"
const VALID_KEY = "1";

// API xác thực key
app.post('/api/verify', (req, res) => {
    const { key } = req.body;
    console.log(`[VERIFY] Nhận key: ${key}`);

    if (key === VALID_KEY) {
        // Tạo token giả (có thể dùng JWT nếu muốn phức tạp hơn)
        const token = Buffer.from(`user:${Date.now()}`).toString('base64');
        return res.json({
            success: true,
            valid: true,
            message: "Key hợp lệ",
            token: token,
            redirect: "/dashboard"
        });
    } else {
        return res.status(401).json({
            success: false,
            valid: false,
            message: "Key không tồn tại trong hệ thống"
        });
    }
});

// API kiểm tra token (nếu web dùng token để giữ session)
app.post('/api/check-token', (req, res) => {
    const { token } = req.body;
    if (token && token.length > 0) {
        return res.json({ valid: true, user: "premium" });
    }
    return res.status(401).json({ valid: false });
});

// API lấy dữ liệu dự đoán (yêu cầu token hợp lệ)
app.get('/api/predict', (req, res) => {
    const token = req.headers.authorization;
    if (!token || token !== "fake_token_123") {
        return res.status(403).json({ error: "Unauthorized" });
    }
    return res.json({
        game: "Tài Xỉu",
        predict: "Tài",
        odds: 0.85,
        accuracy: "71.5%"
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Fake server chạy tại http://localhost:${PORT}`);
    console.log(`✅ Key hợp lệ duy nhất: ${VALID_KEY}`);
});
