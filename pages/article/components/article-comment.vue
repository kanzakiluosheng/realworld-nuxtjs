<template>
  <div>
    <form class="card comment-form" @submit.prevent>
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="body"
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user&&user.image?user.image:'/smiley-cyrus.jpg'" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click.stop="createComment(article.slug)" :disabled="postDisabled">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: { username: comment.author.username },
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: { username: comment.author.username },
          }"
          class="comment-author"
          >{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{
          comment.createdAt | date("MMM DD,YYYY")
        }}</span>
        <!-- <span class="mod-options" v-if="user&&(user.username===comment.author.username||article.author.username===user.username)"> -->
        <span class="mod-options" v-if="user&&user.username===comment.author.username">
          <!-- <i class="ion-edit"></i> -->
          <i class="ion-trash-a" @click="deleteComment(article.slug,comment.id)"></i>
        </span>
      </div>
    </div>

  </div>
</template>

<script>
import { getComments,addComment,deltComment } from "@/api/comment";
import { mapState } from "vuex";
export default {
  name: "ArticleComment",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      body:'',
      postDisabled:false,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  async mounted() {
    const { data } = await getComments(this.article.slug);
    this.comments = data.comments;
  },
  methods:{
    async createComment(slug){
      if(!this.body) return;
      this.postDisabled=true;
      const comment={body:this.body}
      const {data}=await addComment(slug,{comment});
      this.comments.unshift(data.comment);
      this.body='';
      this.postDisabled=false;
    },
    async deleteComment(slug,id){
      const index=this.comments.findIndex(item=>item.id===id)
      await deltComment(slug,id);
      this.comments.splice(index,1);
    }
  }
};
</script>

<style>
</style>