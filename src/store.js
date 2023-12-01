// ./src/store.js
import { createStore } from "vuex";

const store = createStore({
    state() {
        return {
            loggedIn: false,
            user: {
                name: "",
                avatar: "",
            },
        };
    },
    mutations: {
        setLoggedIn(state, loggedIn) {
            state.loggedIn = loggedIn;
        },
        setUser(state, user) {
            state.user = user;
        },
    },
});

export default store;
