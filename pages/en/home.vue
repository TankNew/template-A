<template>
  <section class="home">
    <section class="container">
      <h3 class="page-title">
        <span class="name">{{ $L('Announce') }}</span>
      </h3>
      <section class="announce">
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
    </section>
    <section class="container product-list">
      <h3 class="page-title">
        <span class="name">{{ productGroup1.displayName }}</span>
        <span class="more">
          <a
            @click="goNewsGroup(productGroup1.id,3)"
            href="javascript:void(0)"
          >{{ $L('More') }} ></a>
        </span>
      </h3>
      <ul>
        <li v-for="item in productGroup1Items" @click="goNewsDetail(item.id,3)">
          <div class="product-container">
            <div class="product-cover">
              <img :src="item.cover" />
            </div>
            <div class="product-info">
              <h3 class="product-title">{{ item.title }}</h3>
              <p v-html="filter(item.content,40)" class="product-content"></p>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <section class="about">
      <section class="container">
        <h3 class="page-title">
          <span class="name">{{ ad1.title }}</span>
        </h3>
        <div class="home-ad-1">
          <div class="ad-content">
            <p class="ad-text">{{ ad1.text }}</p>
            <div class="ad-links">
              <a
                :href="ad1.url?ad1.url:'/'"
                class="button-primary"
              >{{ $L(`More`) }} ></a>
              <a
                :href="'/'+culture+'/contactus'"
                class="button-primary"
              >{{ $L(`ContactUs`) }} ></a>
            </div>
          </div>
          <div class="ad-img">
            <img ref="adImg" :src="ad1.img" />
          </div>
        </div>
      </section>
    </section>
  </section>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import tools from '../../utiltools/tools'
import AppConsts from '../../utiltools/appconst'
export default {
  data() {
    return {
      wordIndex: 0,
      observer: null,
      ad1: {},
      announces: [],
      productGroup1: {},
      productGroup1Items: [],
      isProductLoading: false,
      swiperOption: {
        direction: 'vertical',
        autoHeight: true,
        autoplay: true
      }
    }
  },
  computed: {
    ...mapState({
      currentPath: state => state.app.currentPath,
      culture: state => state.app.culture,
      partners: state => state.app.partners,
      homePage: state => state.app.homePage
    })
  },
  async fetch(context) {
    await context.store.dispatch('app/getHomePage')
  },
  /**存放异步方法 */
  created() {
    this.loadannounce()
    this.loadAd1()
    this.loadProductGroup1()
  },
  mounted() {
    this.loadProductGroup1Chilidren()
    this.loadProductGroup1Items()
  },
  methods: {
    target(id) {
       window.open(`/${this.culture}/announce/detail/` + String(id, '_blank'))
    },
    getImgUrl(val) {
      if (val) return AppConsts.remoteServiceBaseUrl + val
      else return null
    },
    goNewsGroup(id, type) {
      switch (type) {
        case 1:
          this.$router.push(`/${this.culture}/news/` + String(id))
          break
        case 2:
          this.$router.push(`/${this.culture}/photonews/` + String(id))
          break
        case 3:
          this.$router.push(`/${this.culture}/product/` + String(id))
          break
      }
    },
    goNewsDetail(id, type) {
      let typename
      switch (type) {
        case 1:
          typename = 'news'
          break
        case 2:
          typename = 'photonews'
          break
        case 3:
          typename = 'product'
          break
      }
      window.open(`/${this.culture}/` + typename + '/detail/' + String(id), '_blank')
    },
    filter(val, length) {
      return tools.cutString(tools._filter(val), length)
    },
    async loadannounce() {
      const params = {
        params: {
          SkipCount: 0,
          MaxResultCount: 10
        }
      }
      const res = await this.$store.dispatch('app/getAnounces', params)
      this.announces = res.items
    },
    loadProductGroup1() {
      const Groups = this.$store.state.app.homePage.groups.filter(
        x => x.catalogGroup && x.catalogGroup.catalogType === 3
      )
      if (Groups.length > 0) {
        this.productGroup1 = Groups[0].catalogGroup
      }
    },
    async loadProductGroup1Chilidren() {
      this.isProductLoading = true
      if (this.productGroup1.id && this.productGroup1.id > 0) {
        const pa = {
          params: {
            Id: this.productGroup1.id
          }
        }
        const result = await this.$store.dispatch('app/getCatalogGroupList', pa)
        this.productGroup1.children = result
      }
      this.isProductLoading = false
    },
    async loadProductGroup1Items() {
      this.isProductLoading = true
      if (this.productGroup1.id && this.productGroup1.id > 0) {
        const params = {
          params: {
            CatalogGroupId: this.productGroup1.id,
            SkipCount: 0,
            MaxResultCount: 6,
            Sorting: 'IsTop DESC, Number DESC'
          }
        }
        const res = await this.$store.dispatch('app/getCatalogList', params)
        this.productGroup1Items = res.items
      }
      this.isProductLoading = false
    },
    async loadProductGroup1SubGroupItems(item) {
      this.isProductLoading = true
      const params = {
        params: {
          CatalogGroupId: item.id,
          SkipCount: 0,
          MaxResultCount: 8,
          Sorting: 'IsTop DESC, Number DESC'
        }
      }
      const res = await this.$store.dispatch('app/getCatalogList', params)
      this.productGroup1Items = res.items
      this.isProductLoading = false
    },
    loadAd1() {
      this.ad1 = this.homePage.blocks.length > 0 ? this.homePage.blocks[0] : {}
    }
  }
}
</script>
