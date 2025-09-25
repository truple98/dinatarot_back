"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const reading_routes_1 = __importDefault(require("./routes/reading.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN
}));
// UTF-8 인코딩 설정
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});
app.use('/api', reading_routes_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'Dinatarot is running dayo' });
});
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT} DAYO`);
});
//# sourceMappingURL=index.js.map