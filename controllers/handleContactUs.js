const Joi = require("joi");
const email = require("../utils/email");

const contactUsSchema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    department: Joi.string().required(),
    subject: Joi.string().required().label("Subject"),
    description: Joi.string().required().label("Description"),
    status: Joi.string().required(),
});

async function handleContactUs(req, res) {
    const value = await contactUsSchema.validateAsync(req.body);
    await email.send({
        message: {
            to: process.env.USER,
        },
        template: "contact_us",
        locals: {
            subject: value.subject,
            department: value.department,
            description: value.description,
            customer: {
                name: value.name,
                email: value.email,
                type: value.status,
            },
        },
    });
    res.status(200).send({ message: "Request send successfully" });
}
module.exports = { handleContactUs };
