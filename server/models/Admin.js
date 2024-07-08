import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      maxlength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

AdminSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, role: this.role}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
  return token;
};

const Admin = mongoose.model("Admin", AdminSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().valid("admin", "superadmin").label("Role"), // Include role in validation
  });
  return schema.validate(data);
};

export { Admin, validate };
