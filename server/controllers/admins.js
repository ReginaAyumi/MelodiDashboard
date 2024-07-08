import { Admin } from "../models/Admin.js";

export const getAdmin = async (req, res) => {
    try {
      const { adminId } = req.params;
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(200).json(admin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
