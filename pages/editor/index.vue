<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="description"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="body"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  @keypress.stop="addTag($event)"
                />
                <div class="tag-list" style="margin-top:10px">
                   <span
                      v-for="item in tagList"
                      :key="item"
                      class="tag-pill tag-default"
                    >
                      <i class="ion-close" @click="delTag(item)"></i>{{item}}
                    </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="submitArticle"
                >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {createAtricle,getArticle,updateArticles} from '@/api/article'
export default {
  middleware: ["authenticated","common"],
  name: "EditorIndex",
  data(){
    return{
      title:'',
      description:'',
      body:'',
      tagList:[],
    }
  },
  async created(){
    const {slug}=this.$route.query;
    if(!slug) return;
    const {data}=await getArticle(slug);
    const {title,description,body,tagList}=data.article;
    this.title=title;
    this.description=description;
    this.body=body;
    this.tagList=tagList;
  },
  methods:{
    addTag(e){
      e.cancelBubble = true; 
      e.stopPropagation(); 
      if (e.keyCode === 13) {
        const value=e.target.value;
        const index=this.tagList.findIndex(item=>item===value);
        if(index<0&&value){
          this.tagList.push(value);
        }
        e.target.value=null
      }
    },
    delTag(tag){
      const index=this.tagList.findIndex(item=>item===tag);
      if(index!=-1){
        this.tagList.splice(index,1)
      }
    },
    async submitArticle(){
      const article={
        title:this.title,
        description:this.description,
        body:this.body,
        tagList:this.tagList,
      }
      const {slug}=this.$route.query;
      const putAtricle=slug?updateArticles:createAtricle;
      const {data}=await putAtricle({article},slug||'');
      this.$router.push(`/article/${data?.article?.slug||slug}`);
    }
  }
};
</script>

<style>
</style>