<template>
  <div class="container">
    <h4 class="page-title">
      <span
        class="name"
      >{{ currentPathParent!==null?currentPathParent.displayName:currentPath.displayName }}</span>
    </h4>
    <nuxt-child />
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      navbars: state => state.app.navbars,
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent
    })
  },
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  },
  created() {},
  methods: {}
}
</script>
