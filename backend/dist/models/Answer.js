"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AnswerSchema = new Schema({
    answer: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
    },
    upvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    downvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ]
}, {
    timestamps: true
});
const Answer = mongoose_1.default.model("Answer", AnswerSchema);
exports.default = Answer;
