const mongoose = require("mongoose");
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    ("db connected");
  } catch (error) {
    error;
    throw new Error(error);
  }
};
module.exports = {
  dbConnection,
};
