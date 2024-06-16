import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true,

    },
    token:{
        type: String,
        required: [true, "please Enter Your OTP"],
    },
    createdAt:{
        type: Date,
        required: true
    },
    expiresAt:{
        type: Date,
        required: true
    }
  },
  { timestamps: false, versionKey: false }
);

const Token = mongoose.model("Token", DataSchema);

export default Token;
