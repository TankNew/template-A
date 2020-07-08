<template>
  <nuxt />
</template> 
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import AppConsts from '../utiltools/appconst'
export default {
  head() {
    return {
      link:
        process.env.NODE_ENV === 'production'
          ? [
              { rel: 'stylesheet', href: `/css/bootstrap.css` },
              { rel: 'stylesheet', href: `/css/theme.${this.theme}.css` }
            ]
          : [{ rel: 'stylesheet', href: `/css/bootstrap.css` }]
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      theme: state => state.theme
    })
  },
  created() {}
}
</script>
