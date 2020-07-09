<template>
  <section class="home">
    <section v-if="announces.length>0" class="container">
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
    <section v-if="productGroup1" class="container product-list">
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
              <p v-html="filter(item.content,100)" class="product-content"></p>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <section v-if="ad1" class="about">
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
  /**存放异步方法 */
  async asyncData({ isDev, route, store, env, query, req, res, redirect, error }) {
    await store.dispatch('app/getHomePage')

    let newsGroup1, picGroup1, productGroup1, productGroup1Items, params, ad1, announces
    const homeGroups = store.state.app.homePage.groups.filter(x => x.catalogGroup)

    ad1 = store.state.app.homePage.blocks.length > 0 ? store.state.app.homePage.blocks[0] : null
    newsGroup1 =
      homeGroups.filter(x => x.catalogGroup.catalogType === 1).length > 0
        ? homeGroups.filter(x => x.catalogGroup.catalogType === 1)[0].catalogGroup
        : null
    picGroup1 =
      homeGroups.filter(x => x.catalogGroup.catalogType === 2).length > 0
        ? homeGroups.filter(x => x.catalogGroup.catalogType === 2)[0].catalogGroup
        : null
    productGroup1 =
      homeGroups.filter(x => x.catalogGroup.catalogType === 3).length > 0
        ? homeGroups.filter(x => x.catalogGroup.catalogType === 3)[0].catalogGroup
        : null
    if (newsGroup1 !== null) {
      params = {
        params: {
          CatalogGroupId: newsGroup1.id,
          SkipCount: 0,
          MaxResultCount: 6,
          Sorting: 'IsTop DESC, Number DESC'
        }
      }
      newsGroup1.items = (await store.dispatch('app/getCatalogList', params)).items
    }
    if (picGroup1 !== null) {
      params = {
        params: {
          CatalogGroupId: picGroup1.id,
          SkipCount: 0,
          MaxResultCount: 6,
          Sorting: 'IsTop DESC, Number DESC'
        }
      }
      picGroup1.items = (await store.dispatch('app/getCatalogList', params)).items
    }
    if (productGroup1 !== null) {
      params = {
        params: {
          Id: productGroup1.id
        }
      }
      const result = await store.dispatch('app/getCatalogGroupList', params)
      productGroup1.children = result

      params = {
        params: {
          CatalogGroupId: productGroup1.id,
          SkipCount: 0,
          MaxResultCount: 6,
          Sorting: 'IsTop DESC, Number DESC'
        }
      }
      productGroup1.items = (await store.dispatch('app/getCatalogList', params)).items
    }
    params = {
      params: {
        SkipCount: 0,
        MaxResultCount: 2
      }
    }
    announces = (await store.dispatch('app/getAnounces', params)).items
    return { ad1, announces, newsGroup1, picGroup1, productGroup1 }
  },
  created() {
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
    }
  }
}
</script>
