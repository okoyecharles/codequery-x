"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const QuestionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Answer",
        },
    ],
    intelligentAnswer: {
        type: String,
        required: false,
        default: "",
    }
}, {
    timestamps: true
});
const Question = mongoose_1.default.model("Question", QuestionSchema);
exports.default = Question;
