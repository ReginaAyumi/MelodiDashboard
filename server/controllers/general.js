import User from "../models/User.js";
import { Admin, validate } from "../models/Admin.js";
import Visitor from "../models/Visitor.js";

export const getVisitor = async (req, res) => {
  try {
    const { visitorId } = req.params;
    const visitor = await Visitor.findById(visitorid);
    res.status(200).json(visitor);
  } catch (error) {
    res.status(404).json({ message: error.message});
  }
};


