import path from "path";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";
import customConfig from "./config/default";
import { createContext } from "./lib/context";
import { appRouter } from "./router/main";

dotenv.config({ path: path.join(__dirname, "./.env") });
export type AppRouter = typeof appRouter;

const app = express();
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.use(
	cors({
		origin: [customConfig.origin, "http://localhost:3000"],
		credentials: true,
	})
);

app.use(
	"/api/trpc",
	trpcExpress.createExpressMiddleware({
		router: appRouter,
		createContext,
		onError:
			process.env.NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path}: ${error}`);
				  }
				: undefined,
	})
);

const port = customConfig.port;
app.listen(port, () => {
	console.log(`🚀 Server listening on port ${port}`);
});
