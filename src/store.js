import Vue from 'vue'
import Vuex from 'vuex'
import Rwg from 'random-word-generator'
let randomWords = new Rwg()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    renderedItems: {}
  },
  getters: {
    renderedItems: state => state.renderedItems
  },
  mutations: {
    addItems (state, items) {
      items.forEach(elem => {
        Vue.set(state.renderedItems, elem.x + 'x' + elem.y, {
          text: elem.text,
          disabled: elem.disabled,
          state: elem.state
        })
      })
    }
  },
  actions: {
    addItems ({commit, dispatch}, items) {
      dispatch('filterNewItems', items)
        .then(itemsToFetch => {
          if (itemsToFetch.length) {
            dispatch('fetchItems', itemsToFetch)
          }
        })
    },
    fetchItems ({commit, dispatch}, items) {
      if (items.length) {
        dispatch('addPreloadedItems', items)

        setTimeout(() => {
          let newItemsSet = []
          items.forEach(elem => {
            newItemsSet.push({
              x: elem.x,
              y: elem.y,
              text: randomWords.generate(),
              disabled: false,
              state: 'active'
            })
          })
          if (newItemsSet !== undefined) commit('addItems', newItemsSet)
        }, 500)
      } else {
        console.log('Nothing to add')
        return undefined
      }
    },
    filterNewItems ({getters}, items) {
      let itemsToAdd = items.filter(elem => getters.renderedItems[elem.x + 'x' + elem.y] === undefined)
      console.log(itemsToAdd)

      return itemsToAdd
    },
    addPreloadedItems ({commit}, items) {
      let LoadingtemsSet = []
      items.forEach(elem => {
        LoadingtemsSet.push({
          x: elem.x,
          y: elem.y,
          state: 'loading'
        })
      })
      commit('addItems', LoadingtemsSet)
    }
  }
})
