const { PrismaClient } = require("@prisma/client");

async function seed() {
	const prisma = new PrismaClient();
	await prisma.post.deleteMany();

	const userExists = await prisma.user.findFirst();
	if (!userExists)
		await prisma.user.create({
			data: {
				email: "bob@test.com",
				name: "Bob",
				password: "bob",
			},
		});

	const posts = Array.from({ length: 100000 }, (_, i) => i + 1);
	for (const post of posts) {
		await prisma.post.create({
			data: {
				title: `Post ${post}`,
				body: `This is the body of post number ${post}`,
				author: { connect: { id: 1 } },
			},
		});
	}
	prisma.$disconnect();
}

seed();
