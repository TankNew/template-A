<template>
  <div class="container insider">
    <h4 class="page-title">
      <span class="name">{{ currentPath.displayName }}</span>
      <div
        v-if="currentPath.children&&currentPath.children.length>0&&!isRootGroup"
        class="page-sub-mobile-select"
      >
        <a v-if="collapse" @click="collapse=!collapse">
          {{ $L(`Expand`) }}
          <i class="fas fa-angle-down"></i>
        </a>
        <a v-else @click="collapse=!collapse">
          {{ $L(`Collapse`) }}
          <i class="fas fa-angle-up"></i>
        </a>
      </div>
    </h4>
    <section class="position-relative">
      <div
        v-if="currentPath.children&&currentPath.children.length>0&&!isRootGroup"
        :class="['page-sub-groups',collapse?'':'expand']"
      >
        <div @click="collapse=true" class="table">
          <div @click.stop.prevent class="list">
            <dl>
              <dd v-for="child in currentPath.children" :key="child.id">
                <a
                  @click.stop.prevent="goNewsGroup(child.catalogGroupId,1)"
                  href="javascript:void(0)"
                >{{ child.displayName }}</a>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <section v-if="isRootGroup">
        <div class="page-product-list">
          <ul>
            <li
              v-for="item in subGroups"
              :key="item.id"
              @click="goNewsGroup(item.id,1)"
            >
              <span class="cover">
                <img :src="item.cover" />
              </span>
              <div class="cover-info">
                <span class="cover-title">
                  <a href="javascript:void(0)">{{ item.displayName }}</a>
                </span>
                <p v-html="filter(item.info,40)" class="cover-content"></p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section v-else class="page-news-list-container">
        <div class="page-news-leftbar">
          <dl
            v-if="currentPathParent&&currentPathParent.children.length>0"
            class="page-news-leftbar-groups"
          >
            <dt>{{ $L(`QuickMenu`) }}</dt>
            <dd v-for="item in currentPathParent.children" :key="item.code">
              <a
                @click="goNewsGroup(item.catalogGroupId,1)"
                href="javascript:void(0)"
              >{{ item.displayName }}</a>
            </dd>
          </dl>
          <dl class="page-news-leftbar-contactus">
            <dt>{{ $L(`ContactUs`) }}</dt>
            <dd>
              <label>{{ $L(`Tel`) }}</label>
              {{ companyInfo.tel }}
            </dd>
            <dd>
              <label>{{ $L(`Email`) }}</label>
              {{ companyInfo.email }}
            </dd>
          </dl>
        </div>
        <div class="page-news-list">
          <ul>
            <li
              v-for="item in pageContent.items"
              :key="item.id"
              @click="goNewsDetail(item.id,1)"
            >
              <div class="news-info">
                <a class="news-title" href="javascript:void(0)">{{ item.title }}</a>
                <p class="news-intro">{{ filter(item.content,200) }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="my-5">
          <b-pagination
            v-model="currentPage"
            :per-page="perPage"
            :total-rows="pageContent.totalCount"
            @input="pageChange"
            align="center"
            pills
          ></b-pagination>
        </div>
      </section>
    </section>
  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import tools from '../../../utiltools/tools'
export default {
  data() {
    return {
      collapse: true,
      currentPage: 1,
      perPage: 10,
      pageContent: {}
    }
  },
  computed: {
    ...mapState({
      companyInfo: state => state.app.companyInfo,
      culture: state => state.app.culture,
      navbars: state => state.app.navbars,
      currentPath: state => state.app.currentPath,
      currentPathParent: state => state.app.currentPathParent,
      isRootGroup: state =>
        state.app.currentPath.code.split('.').length - 1 === 1 && state.app.currentPath.children.length > 0
    })
  },
  watch: {
    $route(val) {
      this.currentPage = 1
      this.perPage = 10
      this.pageChange()
      console.log(this.currentPath.id)
      console.log(this.currentPathParent.id)
    }
  },
  validate({ params }) {
    // 必须是number类型
    return /^\d+$/.test(params.id)
  },
  async asyncData({ isDev, route, store, env, params, query, req, res, redirect, error }) {
    const subJson = await store.dispatch('app/getCatalogGroupList', { params: { id: route.params.id } })
    return { subGroups: subJson }
  },
  created() {
    this.pageChange()
    console.log(this.currentPath.id)
  },
  methods: {
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
    async pageChange() {
      const params = {
        params: {
          IsActive: true,
          CatalogGroupId: this.$route.params.id,
          SkipCount: (this.currentPage - 1) * this.perPage,
          MaxResultCount: this.perPage
        }
      }
      this.pageContent = await this.$store.dispatch('app/getCatalogList', params)
    }
  }
}
</script>
