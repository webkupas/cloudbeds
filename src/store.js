import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    renderedItems: {},
    rullerX: [],
    rullerY: [],
    dataToSave: {}
  },
  getters: {
    renderedItems: state => state.renderedItems,
    rullerX: state => state.rullerX,
    rullerY: state => state.rullerY,
    dataToSave: state => state.dataToSave
  },
  mutations: {
    addItems (state, items) {
      items.forEach(elem => {
        Vue.set(state.renderedItems, elem.x + 'x' + elem.y, {
          text: elem.text,
          disabled: elem.disabled,
          state: elem.state
        })
        state.rullerX.push(elem.x)
        state.rullerY.push(elem.y)
      })
    },
    addDataToSave (state, data) {
      Vue.set(state.dataToSave, data.x + 'x' + data.y, {
        text: data.text,
        disabled: data.disabled
      })
    },
    flushDataToSave (state) {
      state.dataToSave = {}
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
              text: '' + elem.x + elem.y,
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
    },
    addDataToSave ({commit}, data) {
      commit('addDataToSave', data)
    },
    sendData ({getters, commit}) {
      let dataToSend = []
      let keys = Object.keys(getters.dataToSave)
      keys.forEach(elem => {
        dataToSend.push({
          x: elem.split('x')[0],
          y: elem.split('x')[1],
          text: getters.dataToSave[elem].text,
          disabled: getters.dataToSave[elem].disabled
        })
      })
      console.log('Bye bye my dear data! I will never miss:', dataToSend)
      commit('flushDataToSave')
    }
  }
})
