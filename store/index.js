import axios from 'axios'
import appconst from '../utiltools/appconst'
// 禁用严格模式
const strict = false

//首先，只需将状态导出为 函数，将变量和操作作为 store/index.js 中的对象导出：
const state = () => ({
  number: 0,
  ip: null,
  abp: {},
  theme: {},
  themes: [
    {
      displayName: 'blue',
      hue: '210',
      saturation: '65%',
      lightness: '30%'
    },
    {
      displayName: 'blue-lighter',
      hue: '210',
      saturation: '63%',
      lightness: '50%'
    },
    {
      displayName: 'green',
      hue: '160',
      saturation: '100%',
      lightness: '30%'
    },
    {
      displayName: 'green-dark',
      hue: '142',
      saturation: '66%',
      lightness: '28%'
    },
    {
      displayName: 'orange',
      hue: '13',
      saturation: '100%',
      lightness: '45%'
    },
    {
      displayName: 'purple',
      hue: '300',
      saturation: '20%',
      lightness: '50%'
    },
    {
      displayName: 'red',
      hue: '4',
      saturation: '79%',
      lightness: '60%'
    }
  ]
})
const mutations = {
  DECREMENT_MAIN_COUNTER(state) {
    state.number--
  },
  INCREMENT_MAIN_COUNTER(state) {
    state.number++
  },
  SETENV(state, val) {
    state.theme = val
  }
}

const actions = {
  nuxtServerInit({ commit }) {
    commit('SETENV', this.$config.NUXT_ENV_THEME)
  },
  someAsyncTask({ commit }) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },

  async setIp(context) {
    const ip = (await axios.get('http://icanhazip.com')).data
    context.state.ip = ip
  },

  async getAbp(context) {
    await this.$axios.get('/AbpUserConfiguration/GetAll').then(data => {
      const json = data.data.result
      json.localization.defaultSourceName = appconst.localization.defaultLocalizationSourceName
      context.state.abp = json
    })
  }
}

export default {
  strict,
  state,
  mutations,
  actions
}
