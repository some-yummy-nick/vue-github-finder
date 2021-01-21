export const loading = {
    state: {
        common: false,
        small: false
    },
    mutations: {
        setCommonLoading(state, payload) {
            state.common = payload
        },
        setSmallLoading(state, payload) {
            state.small = payload
        }
    },
    actions: {
        setCommonLoading({commit}, payload) {
            commit('setCommonLoading', payload);
        },
        setSmallLoading({commit}, payload) {
            commit('setSmallLoading', payload);
        }
    },
    getters: {
        getCommonLoading(state) {
            return state.common
        },
        getSmallLoading(state) {
            return state.small
        }
    }
};

export default loading
