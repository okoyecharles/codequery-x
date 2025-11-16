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
exports.deleteQuestion = exports.updateQuestion = exports.askQuestion = exports.getQuestion = exports.searchQuestions = exports.getQuestions = exports.getDetailedQuestion = void 0;
const Question_1 = __importDefault(require("../models/Question"));
const User_1 = __importDefault(require("../models/User"));
const getDetailedQuestion = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return Question_1.default.findById(id)
        .populate({
        path: "answers",
        options: { sort: { createdAt: -1 } },
        populate: { path: "user" },
    })
        .populate("user");
});
exports.getDetailedQuestion = getDetailedQuestion;
/*
 * @route GET /questions
 * @desc Get all questions
 * @access Public
 */
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = yield Question_1.default.find().populate(["user"]);
        const sortedQuestions = questions.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        res.status(200).json({ questions: sortedQuestions });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.getQuestions = getQuestions;
/*
 * @route GET /questions/search?q=question
 * @desc Search for a question
 * @access Public
 */
const searchQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        const questions = yield Question_1.default.find({
            question: { $regex: q, $options: "i" },
        }).populate(["user"]);
        res.status(200).json({ questions });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.searchQuestions = searchQuestions;
/*
 * @route GET /questions/:id
 * @desc Get a question
 * @access Public
 */
const getQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield (0, exports.getDetailedQuestion)(id);
        if (!question) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        res.status(200).json({ question });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.getQuestion = getQuestion;
/*
 * @route POST /questions
 * @desc Create a new question
 * @access Public
 */
const askQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question } = req.body;
    try {
        const user = yield User_1.default.findById(req.user);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const newQuestion = new Question_1.default({ question, answers: [], user: user._id });
        yield newQuestion.save();
        const savedQuestion = yield (0, exports.getDetailedQuestion)(newQuestion._id.toString());
        res
            .status(201)
            .json({
            message: "Question created successfully",
            question: savedQuestion,
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.askQuestion = askQuestion;
/*
 * @route PUT /questions/:id
 * @desc Update a question
 * @access Public
 */
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { question } = req.body;
        const questionExists = yield Question_1.default.findById(id);
        const user = yield User_1.default.findById(req.user);
        if (!questionExists) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (questionExists.user.toString() !== user._id.toString()) {
            res
                .status(401)
                .json({ message: "You are not authorized to update this question" });
            return;
        }
        if (question)
            questionExists.question = question;
        yield questionExists.save();
        const updatedQuestion = yield (0, exports.getDetailedQuestion)(id);
        res
            .status(200)
            .json({
            question: updatedQuestion,
            message: "Question updated successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.updateQuestion = updateQuestion;
/*
 * @route DELETE /questions/:id
 * @desc Delete a question
 * @access Public
 */
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const questionExists = yield Question_1.default.findById(id);
        const user = yield User_1.default.findById(req.user);
        if (!questionExists) {
            res.status(404).json({ message: "Question not found" });
            return;
        }
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (questionExists.user.toString() !== user._id.toString()) {
            res
                .status(401)
                .json({ message: "You are not authorized to delete this question" });
            return;
        }
        yield Question_1.default.deleteOne({ _id: id });
        const questions = yield Question_1.default.find();
        res
            .status(200)
            .json({ questions, message: "Question deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Something went wrong... Please try again" });
    }
});
exports.deleteQuestion = deleteQuestion;
