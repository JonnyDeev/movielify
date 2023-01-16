const { default: mongoose } = require("mongoose");
const connectDB = async () => {
    mongoose.set('strictQuery', false)
  await mongoose
    .connect(process.env.MONGODB_URI, {
    })
    .then((db) => console.log("DB IS CONNECTED"))
    .catch((err) => console.error(err));
};

module.exports = connectDB;
