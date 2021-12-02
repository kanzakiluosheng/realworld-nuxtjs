<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{profile.username}}</h4>
            <p>{{profile.bio}}
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn" 
              :class="{active:profile.following}"
              :disabled="profile.followDisabled||(user&&profile.username===user.username)"
              @click="onFollow(profile)"
            >
              <i v-if="!profile.following" class="ion-plus-round"></i>
              &nbsp; {{profile.following?'Unfollow':'Follow'}} {{profile.username}}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">

        <!-- tab栏 -->
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  exact
                  class="nav-link"
                  :class="{active:tab==='my_articles'}"
                  :to="{
                    name:'profile',
                    query:{
                      tab:'my_articles'
                    }
                  }">
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link 
                  exact
                  class="nav-link" 
                  :class="{active:tab==='favorited_articles'}"
                  :to="{
                    name:'profile',
                    query:{
                      tab:'favorited_articles'
                    }
                  }">
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 文章列表 -->
          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link :to="{
                name:'profile',
                query:{
                  username:article.author.username
                }
              }">
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link :to="{
                  name:'profile',
                  query:{
                    username:article.author.username
                  }
                }" 
                class="author">
                  {{article.author.username}}
                </nuxt-link>
                <span class="date">{{article.createdAt|date('MMM DD,YYYY')}}</span>
              </div>
              <button 
                class="btn btn-outline-primary btn-sm pull-xs-right" 
                :class="{active:article.favorited}" 
                :disabled="article.favoriteDisabled" 
                @click="onFavorite(article)">
                <i class="ion-heart"></i> {{article.favoritesCount}}
              </button>
            </div>
            <nuxt-link :to="{
              name:'article',
              params:{
                slug:article.slug
              }
            }" 
            class="preview-link">
              <h1>{{article.title}}</h1>
              <p>{{article.description}}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">{{tag}}</li>
              </ul>
            </nuxt-link>
          </div>
          <div v-if="articles&&articles.length===0" class="article-preview" >No articles are here... yet.</div>

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
                  name:'profile',
                  query:{
                    page:item,
                    tab:tab,
                  }
                }"
                  class="page-link"
                >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticles,addFavorite,delFavorite } from "@/api/article";
import { getProfiles,addFollow,delFollow } from "@/api/profile";
import {mapState} from 'vuex';
export default {
  middleware: ["common"],
  name: "ProfileIndex",
  watchQuery:['page','tab'],
  async asyncData({ params, query}) {
    try {
      const tab=query.tab||'my_articles';
      const limit = 20;
      const page = Number.parseInt(query.page) || 1;
      const [articleRes,profileRes]= await Promise.all(
        [getArticles({
          limit,
          offset: (page - 1) * limit,
          author: tab==='favorited_articles'?null:params.username,
          favorited:tab==='favorited_articles'?params.username:null,
        }),
        getProfiles(params.username)]);
      const { profile } = profileRes.data;
      const { articles, articlesCount } = articleRes.data;
      articles.forEach(articles=>articles.favoriteDisabled=false);
      profile.followDisabled=false;
      return {
        profile,
        articles,
        articlesCount,
        page,
        limit,
        tab
      }
    } catch (err) {
      console.dir(err);
    }
  },
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    }
  },
  methods:{
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
    },
    async onFollow(profile){
      profile.followDisabled=true;
      if(profile.following){
        await delFollow(profile.username);
        profile.following=false;
      }else{
        await addFollow(profile.username);
        profile.following=true;
      }
      profile.followDisabled=false;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>