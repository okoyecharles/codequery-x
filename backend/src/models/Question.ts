import mongoose, { InferSchemaType } from "mongoose";

const Schema = mongoose.Schema;
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
},
  {
    timestamps: true
  });

export type QuestionType = InferSchemaType<typeof QuestionSchema>;

const Question = mongoose.model("Question", QuestionSchema);
export default Question;