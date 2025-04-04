import express from "express";
import { getAdmin } from "../controllers/admins.js";
import { Admin, validate } from "../models/Admin.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/admin/:adminId", getAdmin);


router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const admin = await Admin.findOne({ email: req.body.email });
		if (admin)
			return res
				.status(409)
				.send({ message: "Admin with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new Admin({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "Admin created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

export default router;