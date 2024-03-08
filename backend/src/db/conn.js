const mongoose = require("mongoose");

const DataBaseConnection = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_DATABASE_URL}/${process.env.MONGODB_DATABASE_NAME}`
    );
    console.log("Database connected !! host : ", connection.connection.host);
  } catch (error) {
    console.log("Database connection failed: ", error);
    process.exit(1);
  }
};

module.exports = DataBaseConnection;