import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { ResponseError } from "src/types/responseError";
import prisma from "src/lib/prisma";

const signup = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			console.log("after validation");

			const error = new Error("Validation failed") as ResponseError;
			error.statusCode = 422;
			error.data = errors.array();
			throw error;
		}
		console.log("after validation");
		const { email, password, name } = req.body;

		const hashedPw = await bcrypt.hash(password, 12);

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPw,
				name,
			},
		});
		if (user)
			res.status(201).json({
				message: "User created",
				userId: user.id,
			});
	} catch (err: any) {
		console.log("thorw error");
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, password } = req.body;
		let loadedUser;
		const user = await prisma.user.findFirst({ where: { email: email } });
		if (!user) {
			const error = new Error(
				"A user with this email could not be found."
			) as ResponseError;
			error.statusCode = 401;
			throw error;
		}
		loadedUser = user;

		const isPasswordCorrect = bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			const error = new Error("Wrong Pasword") as ResponseError;
			error.statusCode = 401;
			throw error;
		}
		const token = jwt.sign(
			{
				email: loadedUser.email,
				userId: loadedUser.id.toString(),
			},
			"somesupersecretsecret",
			{ expiresIn: "1h" }
		);
		res.status(200).json({
			token: token,
			userId: loadedUser.id.toString(),
		});
	} catch (err: any) {
		if (!err.statusCode) {
			err.statusCode = 500;
		}
		next(err);
	}
};

export default { signup, login };
