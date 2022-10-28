import { router, publicProcedure } from "../lib/trpc";
import { z } from "zod";

export const exampleRouter = router({
	hello: publicProcedure
		.input(z.object({ text: z.string().nullish() }).nullish())
		.query(({ input }) => {
			return {
				greeting: `Hello world`,
			};
		}),
	getPosts: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.post.findMany();
	}),
});
