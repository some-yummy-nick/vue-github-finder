export const repos = {
    state: {
        items: []
    },
    mutations: {
        setItems(state, payload) {
            state.items = payload
        }
    },
    actions: {
        setItems({commit}, payload) {
            commit('setItems', payload)
        }
    },
    getters: {
        getItems(state) {
            return state.items
        }

    }
};

export default repos
