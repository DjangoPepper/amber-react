import { configureStore} from "@reduxjs/toolkit";
import reducer from "./rootReducer";

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
        if (process.env.NODE_ENV === "development") {
            const { logger } = require("redux-logger");
            return getDefaultMiddleware().concat(logger);
        }
        return getDefaultMiddleware();
    }
});

export type RootState = ReturnType<typeof store.getState>;
