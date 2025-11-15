import mongoose, { InferSchemaType } from "mongoose";

const Schema = mongoose.Schema;
export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
});

export type UserType = InferSchemaType<typeof UserSchema>;

const User = mongoose.model("User", UserSchema);
export default User;