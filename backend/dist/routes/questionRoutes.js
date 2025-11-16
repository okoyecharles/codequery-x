"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("./../middleware/authMiddleware");
const express_1 = __importDefault(require("express"));
const questionController_1 = require("../controllers/questionController");
const answerController_1 = require("../controllers/answerController");
const router = express_1.default.Router();
// Question routes
router.get('/', questionController_1.getQuestions);
router.get('/search', questionController_1.searchQuestions);
router.post('/', authMiddleware_1.protect, questionController_1.askQuestion);
router.get('/:id', questionController_1.getQuestion);
router.delete('/:id', authMiddleware_1.protect, questionController_1.deleteQuestion);
router.put('/:id', authMiddleware_1.protect, questionController_1.updateQuestion);
// Answer routes
router.get('/:id/answers', answerController_1.getAnswers);
router.post('/:id/answers', authMiddleware_1.optionalProtect, answerController_1.answerQuestion);
router.put('/:id/answers/intelligent', authMiddleware_1.protect, answerController_1.getAIAnswer);
router.delete('/:id/answers/:answerId', authMiddleware_1.protect, answerController_1.deleteAnswer);
router.put('/:id/answers/:answerId', authMiddleware_1.protect, answerController_1.updateAnswer);
router.put('/:id/answers/:answerId/upvote', authMiddleware_1.protect, answerController_1.upvoteAnswer);
router.put('/:id/answers/:answerId/downvote', authMiddleware_1.protect, answerController_1.downvoteAnswer);
exports.default = router;
