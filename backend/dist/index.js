"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/questionRoutes"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json({ limit: '30mb' }));
app.use(express_1.default.urlencoded({ limit: '30mb', extended: true }));
app.use((0, cors_1.default)({ origin: process.env.ORIGIN, credentials: true }));
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use('/users', userRoutes_1.default);
app.use('/questions', questionRoutes_1.default);
(0, db_1.default)().then(() => {
    app.get('/', (req, res) => {
        res.send('Hello World from CodeQuery!');
    });
    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
});
