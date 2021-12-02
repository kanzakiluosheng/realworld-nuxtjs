import {request} from "@/plugins/request";

//获取文章评论
export const getComments= slug => {
    return request({
      method: "GET",
      url: `/api/articles/${slug}/comments`,
    });
  }

//获取文章评论
export const addComment= (slug,data) => {
    return request({
      method: "POST",
      url: `/api/articles/${slug}/comments`,
      data
    });
  }

//获取文章评论
export const deltComment= (slug,id) => {
    return request({
      method: "DELETE",
      url: `/api/articles/${slug}/comments/${id}`,
    });
  }