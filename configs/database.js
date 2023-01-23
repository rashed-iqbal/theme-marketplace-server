const mongoose = require("mongoose");

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        mongoose.connect(process.env.DB, connectionParams);
        console.log("Database connected Successfully");
    } catch (error) {
        console.log(error);
        console.log("Fail to connect with Database!");
        process.exit(1);
    }
};
