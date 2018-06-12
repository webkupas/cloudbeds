import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    /**
     * Stores Items which are already been rendered on a page
     *
     * example:
     *
     * {
     *  ...
     *  12x456 : { // property name consists from item coords 12x456 = x:12, y:456
     *    disabled: false
     *    state: 'active'
     *    text: '101'
     *  }
     *  ...
     * }
     */
    renderedItems: {},
    /**
     * Stores already rendered ruller cells by x axios
     * example: [1,2,3,6,...90, ..]
     */
    rullerX: [],
    /**
     * Stores already rendered ruller cells by x axios
     * example: [1,2,3,6,...90, ..]
     */
    rullerY: [],
    /**
     * Stores updated Items.
     * example:
     *  {
     *  ...
     *  12x456 : { // property name consists from item coords 12x456 = x:12, y:456
     *    initDisabled: false,
     *    disabled: false,
     *    initText: '10',
     *    text: '101',
     *  }
     *  ...
     * }
     */
    dataToSave: {}
  },
  getters: {
    renderedItems: state => state.renderedItems,
    rullerX: state => state.rullerX,
    rullerY: state => state.rullerY,
    dataToSave: state => state.dataToSave
  },
  mutations: {
    /**
     * Add new items to renderedItems
     * @param state
     * @param {Array} items
     *
     * example:
     * items = [
     *  ...,
     *  {
     *    x: 1, // Number
     *    y: 3, // Number
     *    text: '123123', // String (only digits allows)
     *    disabled: false, // Boolean (to disable text updating)
     *    state: 'active' // String ('active'|'loading' - to add specific styles on frontend)
     *  },
     *  ...
     * ]
     */
    addItems (state, items) {
      items.forEach(elem => {
        Vue.set(state.renderedItems, elem.x + 'x' + elem.y, {
          text: elem.text,
          disabled: elem.disabled,
          state: elem.state
        })
        if (!state.rullerX.includes(elem.x)) state.rullerX.push(elem.x)
        if (!state.rullerY.includes(elem.y)) state.rullerY.push(elem.y)
      })
    },
    /**
     * Add updated data in separate array
     * and hold it until data will be sent
     * @param state
     * @param {Object} data
     *
     * example:
     * data = {
     *  x: 1, // Number
     *  y: 3, // Number
     *  data: {
     *    text: '123123', // String (only digits allows)
     *    disabled: false, // Boolean (to disable text updating)
     *    initText: '123' // initial text
     *    initDisabled: false // initial disable state
     *  }
     * }
     */
    addDataToSave (state, data) {
      Vue.set(state.dataToSave, data.x + 'x' + data.y, data.data)
    },
    /**
     * Remove item from state.dataToSave by it's uniq property name
     * @param  state
     * @param  {String} propertyName
     *
     * example:
     * propertyName = '12x427'
     */
    removeDataToSave (state, propertyName) {
      Vue.delete(state.dataToSave, propertyName)
    },
    /**
     * Remove all date from dataToSave.
     * @param state
     */
    flushDataToSave (state) {
      state.dataToSave = {}
    }
  },
  actions: {
    /**
     * Add new data to store
     * @param {dispatch}
     * @param {Array} items
     * example:
     * items = [
     *  ...,
     *  {
     *    x: 1, // Number
     *    y: 3, // Number
     *  },
     *  ...
     * ]
     */
    addItems ({dispatch}, items) {
      dispatch('filterNewItems', items)
        .then(itemsToFetch => {
          if (itemsToFetch.length) {
            dispatch('fetchItems', itemsToFetch)
          }
        })
    },
    /**
     * Fetch items
     * @param {commit, dispatch}
     * @param {Array} items
     * example:
     * items = [
     *  ...,
     *  {
     *    x: 1, // Number
     *    y: 3, // Number
     *  },
     *  ...
     * ]
     */
    fetchItems ({commit, dispatch}, items) {
      if (items.length) {
        dispatch('addPreloadedItems', items)

        /* Emulate server response */
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
    /**
     * Exclude items whach are already in store
     * @param {getters}
     * @param {Array} items
     * example:
     * items = [
     *  ...,
     *  {
     *    x: 1, // Number
     *    y: 3, // Number
     *  },
     *  ...
     * ]
     * @returns {Array} - filtered items array with same structure
     */
    filterNewItems ({getters}, items) {
      let itemsToAdd = items.filter(elem => getters.renderedItems[elem.x + 'x' + elem.y] === undefined)
      return itemsToAdd
    },
    /**
     * Add empty items
     * @param {commit}
     * @param {Array} items
     * example:
     * items = [
     *  ...,
     *  {
     *    x: 1, // Number
     *    y: 3, // Number
     *  },
     *  ...
     * ]
     */
    addPreloadedItems ({commit}, items) {
      let LoadingItemsSet = []
      items.forEach(elem => {
        LoadingItemsSet.push({
          x: elem.x,
          y: elem.y,
          state: 'loading'
        })
      })
      commit('addItems', LoadingItemsSet)
    },
    /**
     * Add updated data in separate array
     * and hold it until data will be sent
     * @param {commit}
     * @param {Object} data
     *
     * example:
     * data = {
     *  x: 1, // Number
     *  y: 3, // Number
     *  text: '123123', // String (only digits allows)
     *  disabled: false, // Boolean (to disable text updating)
     * }
     */
    addDataToSave ({getters, commit}, data) {
      let currentState = getters.dataToSave[data.x + 'x' + data.y] || {}
      currentState.disabled = data.disabled
      currentState.text = data.text

      /* If current Item state similar to it initial state then remove it from state.dataToSave */
      if (currentState.disabled === currentState.initDisabled && currentState.text === currentState.initText) {
        commit('removeDataToSave', data.x + 'x' + data.y)
      } else {
        /* else add Item to state.dataToSave */
        commit('addDataToSave', {x: data.x, y: data.y, data: currentState})
      }
    },
    /**
     * Add initial text state
     * @param {getters, commit}
     * @param {Object} data
     *
     * example:
     * data = {
     *  x: 1, // Number
     *  y: 3, // Number
     *  initText: '123123', // String (only digits allows)
     * }
     */
    addInitTextState ({getters, commit}, data) {
      let currentState = getters.dataToSave[data.x + 'x' + data.y] || {}
      currentState.initText = data.initText
      commit('addDataToSave', {x: data.x, y: data.y, data: currentState})
    },
    /**
     * Add initial text state
     * @param {getters, commit}
     * @param {Object} data
     *
     * example:
     * data = {
     *  x: 1, // Number
     *  y: 3, // Number
     *  initDisabled: false, // Boolean (to disable text updating)
     * }
     */
    addInitDisabledState ({getters, commit}, data) {
      let currentState = getters.dataToSave[data.x + 'x' + data.y] || {}
      currentState.initDisabled = data.initDisabled
      commit('addDataToSave', {x: data.x, y: data.y, data: currentState})
    },
    /**
     * Send updated data and flush state.dataToSave
     * @param {getters, commit}
     *
     * data sends in format Array of Objects:
     * [
     *  ...
     *  {
     *    x: 1, // Number
     *    y: 3, // Number
     *    text: '123123', // String (only digits allows)
     *    disabled: false, // Boolean (to disable text updating)
     *  }
     *  ...
     * ]
     */
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
