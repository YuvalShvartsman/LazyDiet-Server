import express from "express";

import { usersRouter } from "./usersRouter";
import { userPreferencesRouter } from "./userPreferencesRouter";
import { goalsRouter } from "./goalsRouter";
import { dietTypesRouter } from "./dietTypesRouter";
import { sensitivitiesRouter } from "./sensitivitiesRouter";

const routes = express();

routes.use("/users/", usersRouter);
routes.use("/userPreferences/", userPreferencesRouter);
routes.use("/goals/", goalsRouter);
routes.use("/dietTypes/", dietTypesRouter);
routes.use("/sensitivities/", sensitivitiesRouter);

export default routes;
