import { configureStore} from "@reduxjs/toolkit";
import reducer from "./rootReducer";

const middleware = [];

if (process.env.NODE_ENV === "development") {
    const { logger } = require("redux-logger");
    middleware.push(logger);
}

export const store = configureStore({
    reducer,
    middleware
});

export type RootState = ReturnType<typeof store.getState>;