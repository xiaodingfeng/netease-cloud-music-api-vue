import Vue from "vue";
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        aplayer: null,
        itemList: [],
        playKey: 0
    },
    mutations: {
        setAplayer (state, aplayer) {
           state.aplayer = aplayer
        },
        setItemList (state, itemList) {
            state.itemList = itemList
        },
        setPlayKey (state, playKey) {
            state.playKey = playKey
        }
    }
})
