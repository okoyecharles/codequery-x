"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = exports.optionalProtect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET || '';
const tokenName = process.env.SESSION_TOKEN_NAME;
const optionalProtect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // If system doesn't support cookies, use authorization header
    const cookieToken = req.cookies[tokenName];
    const requestToken = cookieToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (requestToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(requestToken, secret);
            req.user = decoded.id;
            next();
        }
        catch (err) {
            res.clearCookie(tokenName);
            next();
        }
    }
    else {
        next();
    }
});
exports.optionalProtect = optionalProtect;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // If system doesn't support cookies, use authorization header
    const cookieToken = req.cookies[tokenName];
    const requestToken = cookieToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    if (requestToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(requestToken, secret);
            req.user = decoded.id;
            next();
        }
        catch (err) {
            res.clearCookie(tokenName);
            res.status(400).json({ message: 'Not authorized' });
        }
    }
    else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});
exports.protect = protect;
