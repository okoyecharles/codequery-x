import mongoose, { InferSchemaType } from "mongoose";

const Schema = mongoose.Schema;
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
},
  {
    timestamps: true
  });

export type AnswerType = InferSchemaType<typeof AnswerSchema>;

const Answer = mongoose.model("Answer", AnswerSchema);
export default Answer;
