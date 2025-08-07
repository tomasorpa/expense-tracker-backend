const mongoose = require("mongoose");
const User = require("./User");

const ExpenseSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: User,
      required: true,
    },
    icon: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Expense", ExpenseSchema);
