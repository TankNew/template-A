export default function({ $axios, store, app, redirect }) {
  $axios.onRequest(
    config => {
      config.headers.common[store.state.app.headerName] = store.getters['app/getCulture']

      const multiTenancyHeader = 'Abp.TenantId'
      const multiTenancy = app.$cookies.get(multiTenancyHeader)
      config.headers.common[multiTenancyHeader] = process.env.TENANT_ID || '18'

      return config
    },
    function(error) {
      return Promise.reject(error)
    }
  )

  $axios.onResponse(
    response => {
      return response
    },
    error => {
      if (
        !!error.response &&
        !!error.response.data.error &&
        !!error.response.data.error.message &&
        error.response.data.error.details
      ) {
        console.error(error.response.data.error.message)
        console.error(error.response.data.error.details)
      } else if (!!error.response && !!error.response.data.error && !!error.response.data.error.message) {
        console.error(error.response.data.error.message)
        redirect('/error')
      } else if (!error.response) {
        console.error(`no response`)
      }
      console.error(`ajax error`)
      return Promise.reject(error)
    }
  )
}
