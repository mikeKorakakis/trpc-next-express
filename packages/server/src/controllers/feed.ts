import { Request, Response, NextFunction } from "express";
import prisma from "src/lib/prisma";

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
	const { pageIndex, pageSize } = req.query;
	const pageIdx = parseInt(pageIndex as string);
	const pageSz = parseInt(pageSize as string);
    const postCount = await prisma.post.count();
	const posts = await prisma.post.findMany({
		include: { author: true },
		take: pageSz,
		skip: pageIdx * pageSz,
	});
	return res
		.status(200)
		.json({ data: posts, pageCount: Math.ceil(postCount / pageSz) });
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
	const { title, body } = req.body;

	const user = await prisma.user.findFirst();

	const post = await prisma.post.create({
		data: {
			title,
			body,
			author: { connect: { id: 1 } },
		},
	});

	res.status(201).json({ post });
};

export default { getPosts, createPost };
