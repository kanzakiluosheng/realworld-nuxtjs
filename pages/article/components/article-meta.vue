<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createdAt | date("MMM DD,YYYY") }}</span>
    </div>

    <template v-if="user && article.author.username === user.username">
      <nuxt-link 
        class="btn btn-outline-secondary btn-sm" 
        :to="{
          name: 'editor',
          query: {
            slug: article.slug,
          },
        }"
      >
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      &nbsp;&nbsp;
      <button class="btn btn-outline-danger btn-sm" @click="delArticle(article.slug)" :disabled="deleteDisabled">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
        :disabled="article.author.followDisabled"
        @click="onFollow"
      >
        <i v-if="!article.author.following" class="ion-plus-round"></i>
        &nbsp; {{article.author.following?'Unfollow':'Follow'}} {{article.author.username}}
        <!-- <span class="counter">(10)</span> -->
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        :disabled="article.favoriteDisabled"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>

  </div>
</template>

<script>
import { delArticles,addFavorite,delFavorite} from "@/api/article";
import { addFollow,delFollow } from "@/api/profile";
import { mapState } from "vuex";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      deleteDisabled: false,
    };
  },
  created(){
    this.article.favoriteDisabled=false;
    this.article.author.followDisabled=false;
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async delArticle(slug) {
      this.deleteDisabled=true;
      await delArticles(slug);
      this.deleteDisabled=false;
      this.$router.push("/");
    },
    async onFavorite(){
      const article=this.article;
      article.favoriteDisabled=true;
      if(article.favorited){
        await delFavorite(article.slug);
        article.favorited=false;
        article.favoritesCount += -1;
      }
      else{
        await addFavorite(article.slug);
        article.favorited=true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled=false;
    },
    async onFollow(){
      const article=this.article;
      article.author.followDisabled=true;
       if(article.author.following){
          await delFollow(article.author.username);
          article.author.following=false;
      }
      else{
         await addFollow(article.author.username);
         article.author.following=true;
      }
      article.author.followDisabled=false;
    },
  },
};
</script>

<style>
</style>