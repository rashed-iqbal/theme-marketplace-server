module.exports = ({ log } = { log: false }) => {
    return (err, req, res, next) => {
        log && console.log(err);
        res.status(err.statusCode || 500).send({
            message: err.message || "Something went wrong",
        });
    };
};
