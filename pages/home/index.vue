<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <!-- tab栏 -->
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                 :class="{
                    active:tab==='your_feed'
                  }"
                  :to="{
                    name:'home',
                    query:{
                      tab:'your_feed'
                    }
                }"
                  exact
                  class="nav-link"
                >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                   :class="{
                    active:tab==='global_feed'
                  }"
                  :to="{
                    name:'home',
                    query:{
                      tab:'global_feed'
                    }
                }"
                >Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{
                    active:tab==='tag'
                  }"
                  :to="{
                    name:'home',
                    query:{
                      tab:'tag'
                    }
                }"
                >#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 文章列表 -->
          <div v-for="article in articles" :key="article.slug" class="article-preview">
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                >{{ article.author.username }}</nuxt-link>
                <span class="date">{{ article.createdAt|date('MMM DD,YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i>
                {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{article.title}}</h1>
              <p>{{article.description}}</p>
              <ul class="tag-list">
                <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">{{tag}}</li>
              </ul>
              <span>Read more...</span>
            </nuxt-link>
          </div>

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                v-for="item in totalPage"
                :key="item"
                class="page-item"
                :class="{active:item===page}"
              >
                <nuxt-link
                  :to="{
                  name:'home',
                  query:{
                    page:item,
                    tag:$route.query.tag,
                    tab:tab,
                  }
                }"
                  class="page-link"
                >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>

        <!--标签列表 -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link
                v-for="item in tags"
                :key="item"
                :to="{
                  name:'home',
                  query:{
                    tag:item,
                    tab:'tag'
                  }
                }"
                class="tag-pill tag-default"
              >{{item}}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles,getFeedArticles,addFavorite,delFavorite } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState,mapMutations} from "vuex";
export default {
  middleware: ["common"],
  name: "HomeIndex",
  watchQuery: ["page", "tag", "tab"],
  async asyncData({ query,store }) {
    try {
      const { tag } = query;
      const page = Number.parseInt(query.page) || 1;
      const limit = 20;
      const tab=query.tab || "global_feed"
      const loadArticles=store.state.user&&tab==='your_feed'?getFeedArticles:getArticles;
      const [articleRes, tagRes] = await Promise.all([
        loadArticles({
          limit,
          offset: (page - 1) * limit,
          tag
        }),
        getTags()
      ]);
      const { articles, articlesCount } = articleRes.data;
      const { tags } = tagRes.data;
      articles.forEach(articles=>articles.favoriteDisabled=false);
      return {
        articles,
        articlesCount,
        page,
        limit,
        tag,
        tags:tags&&tags.slice(0,99),
        tab
      };
    } catch (err) {
      console.dir(err);
    }
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    }
  },
  methods:{
    ...mapMutations(["setUser"]),
    async onFavorite(article){
      article.favoriteDisabled=true;
      if(article.favorited){
        await delFavorite(article.slug);
        article.favorited=false;
        article.favoritesCount += -1;
      }else{
        await addFavorite(article.slug);
        article.favorited=true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled=false;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>