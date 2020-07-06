<template>
  <section class="container">
    <h4 class="page-title">
      <span>{{ announce.title }}</span>
    </h4>
    <h6 class="page-sub-title">{{ formatDate(announce.creationTime) }}</h6>
    <div class="page-content limit-width">
      <div v-html="announce.content" class="news-detail"></div>
      <section class="page-content-announce">
        <client-only>
          <div v-swiper:mySwiper="swiperOption">
            <div class="swiper-wrapper position-relative">
              <div
                v-for="(item, index) in announces"
                :key="index"
                @click="target(item.id)"
                class="swiper-slide"
              >
                <img :src="item.cover" />
                <div class="slide-info">
                  <a>{{ item.title }}</a>
                </div>
              </div>
            </div>
          </div>
        </client-only>
      </section>
    </div>
  </section>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import tools from '../../../../utiltools/tools'
export default {
  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        autoHeight: true,
        on: {
          slideChange() {},
          tap() {}
        }
      }
    }
  },
  computed: {
    ...mapState({
      culture: state => state.app.culture
    })
  },
  async asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    const id = route.params.id
    const announce = await store.dispatch('app/getAnounce', { params: { id } })
    const announcesParams = {
      params: {
        SkipCount: 0,
        MaxResultCount: 10
      }
    }
    const announces = (await store.dispatch('app/getAnounces', announcesParams)).items
    return { announce, announces }
  },
  created() {
    this.$store.dispatch('app/setcurrentPath', {
      path: `/${this.culture}/home`
    })
  },
  methods: {
    target(id) {
      window.open(`/${this.culture}/announce/detail/` + String(id, '_blank'))
    },
    formatDate(val) {
      return tools.date(val)
    }
  }
}
</script>
