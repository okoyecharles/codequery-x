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
exports.downvoteAnswer = exports.upvoteAnswer = exports.updateAnswer = exports.deleteAnswer = exports.answerQuestion = exports.getAIAnswer = exports.getAnswers = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
const Question_1 = __importDefault(require("../models/Question"));
const Answer_1 = __importDefault(require("../models/Answer"));
const User_1 = __importDefault(require("../models/User"));
const questionController_1 = require("./questionController");
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
function generatePrompt(question) {
    const preAnswerPrompt = `
    You are meant to help people find answers to programming related questions.
    
    If the question below is not programming related and/or isn't really a question at all, please let the user know that you could not find an answer to the question nicely with 200 character reason. Normal answers have a maximum of 750 characters.

    ${question.intelligentAnswer ? `The question has already been answered. Please provide a new answer, (Previous Answer: ${question.intelligentAnswer}).` : ""}

    RULES ABOUT ANSWER: user interface is rendered in html, please return your answer as HTML (the UI will render what you return in dangerouslySetInnerHTML. if you ever have to add code samples, use escape characters). To render <em> in a code sample you must return &lt;em&gt; (obviously use tags like <br> here to structure the code) but if you simply want to emphasize text go ahead and use <em>, this applies for everything.

		Please do not use \`\`\`html \`\`\` to surround the answer (html won't format that). Never use markdown.

    Please provide an answer to the following question:

    """
    ${question.question}
    """
  `;
    return preAnswerPrompt;
}
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const genAIModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
/*
 * @route GET /questions/:id/answers
 * @desc Get all answers for a question
 * @access Public
 */
const getAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield Question_1.default.findById(id);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        const answers = yield Answer_1.default.find({ question: id }).populate("user");
        res.status(200).json({ answers });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.getAnswers = getAnswers;
/*
 * @route PUT /questions/:id/intelligent
 * @desc Get an answer from Artifitial Intelligence
 * @access Public
 */
const getAIAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield Question_1.default.findById(id);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        const prompt = generatePrompt(question);
        const result = yield genAIModel.generateContent(prompt);
        let response = result.response.text();
        // strip off ```html and ``` from end of response
        response = response.replace(/```html/g, "");
        response = response.replace(/```/g, "");
        question.intelligentAnswer = response;
        yield question.save();
        const updatedQuestion = yield (0, questionController_1.getDetailedQuestion)(id);
        res
            .status(200)
            .json({
            question: updatedQuestion,
            message: "Intelligent answer added successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: error || "Something went wrong... Please try again" });
    }
});
exports.getAIAnswer = getAIAnswer;
/*
 * @route POST /questions/:id/answers
 * @desc Answer a question
 * @access Public
 */
const answerQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { answer } = req.body;
        const question = yield Question_1.default.findById(id);
        const answerer = yield User_1.default.findById(req.user);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        const newAnswer = new Answer_1.default({
            answer,
            user: answerer === null || answerer === void 0 ? void 0 : answerer._id,
            question: id,
        });
        yield newAnswer.save();
        question.answers.push(newAnswer._id);
        yield question.save();
        const updatedQuestion = yield (0, questionController_1.getDetailedQuestion)(id);
        res
            .status(201)
            .json({
            question: updatedQuestion,
            message: "Answer added successfully",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.answerQuestion = answerQuestion;
/*
 * @route DELETE /questions/:id/answers/:answerId
 * @desc Delete an answer
 * @access Public
 */
const deleteAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, answerId } = req.params;
        const question = yield Question_1.default.findById(id);
        const answer = yield Answer_1.default.findById(answerId);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        if (!answer) {
            res.status(404).json({ message: "Answer not found" });
            return;
        }
        question.answers = question.answers.filter((ans) => ans.toString() !== answerId);
        yield question.save();
        yield Answer_1.default.deleteOne({ _id: answerId });
        const updatedQuestion = yield (0, questionController_1.getDetailedQuestion)(id);
        res
            .status(200)
            .json({
            question: updatedQuestion,
            message: "Answer deleted successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.deleteAnswer = deleteAnswer;
/*
 * @route PUT /questions/:id/answers/:answerId
 * @desc Update an answer
 * @access Public
 */
const updateAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, answerId } = req.params;
        const { answer } = req.body;
        const question = yield Question_1.default.findById(id);
        const answerExists = yield Answer_1.default.findById(answerId);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        if (!answerExists) {
            res.status(404).json({ message: "Answer not found" });
            return;
        }
        if (answerExists)
            answerExists.answer = answer;
        yield answerExists.save();
        const updatedQuestion = yield (0, questionController_1.getDetailedQuestion)(id);
        res
            .status(200)
            .json({
            question: updatedQuestion,
            message: "Answer updated successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.updateAnswer = updateAnswer;
/*
 * @route PUT /questions/:id/answers/:answerId/upvote
 * @desc Upvote an answer
 * @access Public
 */
const upvoteAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, answerId } = req.params;
        const userId = req.user;
        if (!userId) {
            res
                .status(401)
                .json({ message: "You must be logged in to upvote an answer" });
            return;
        }
        const answer = yield Answer_1.default.findById(answerId);
        if (!answer) {
            res.status(404).json({ message: "Answer not found" });
            return;
        }
        // If user already upvoted → remove upvote
        const isUpvoted = answer.upvotes.some((u) => u.toString() === userId);
        if (isUpvoted) {
            answer.upvotes = answer.upvotes.filter((uid) => uid.toString() !== userId);
        }
        else {
            // Add upvote + remove downvote
            answer.upvotes.push(new mongoose_1.default.Types.ObjectId(userId));
            answer.downvotes = answer.downvotes.filter((uid) => uid.toString() !== userId);
        }
        yield answer.save();
        const updatedQuestion = yield (0, questionController_1.getDetailedQuestion)(id);
        res.status(200).json({
            question: updatedQuestion,
            message: "Upvote updated successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.upvoteAnswer = upvoteAnswer;
/*
 * @route PUT /questions/:id/answers/:answerId/downvote
 * @desc Downvote an answer
 * @access Public
 */
const downvoteAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, answerId } = req.params;
        const userId = req.user;
        if (!userId) {
            res
                .status(401)
                .json({ message: "You must be logged in to downvote an answer" });
            return;
        }
        const answer = yield Answer_1.default.findById(answerId);
        if (!answer) {
            res.status(404).json({ message: "Answer not found" });
            return;
        }
        // If user already upvoted → remove upvote
        const isDownvoted = answer.downvotes.some((u) => u.toString() === userId);
        // If user already downvoted → remove downvote
        if (isDownvoted) {
            answer.downvotes = answer.downvotes.filter((uid) => uid.toString() !== userId);
        }
        else {
            // Add downvote + remove upvote
            answer.downvotes.push(new mongoose_1.default.Types.ObjectId(userId));
            answer.upvotes = answer.upvotes.filter((uid) => uid.toString() !== userId);
        }
        yield answer.save();
        const updatedQuestion = yield (0, questionController_1.getDetailedQuestion)(id);
        res.status(200).json({
            question: updatedQuestion,
            message: "Downvote updated successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.downvoteAnswer = downvoteAnswer;
