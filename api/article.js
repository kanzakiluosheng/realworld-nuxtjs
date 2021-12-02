import {request} from "@/plugins/request";

//首页文章列表
export const getArticles = params => {
  return request({
    method: "GET",
    url: "/api/articles",
    params
  });
}

//首页文章列表
export const getFeedArticles = params => {
  return request({
    method: "GET",
    url: "/api/articles/feed",
    params
  });
}

//获取文章详情
export const getArticle = slug => {
  return request({
    method: "GET",
    url: `/api/articles/${slug}`,
  });
}

//创建文章
export const createAtricle= data => {
  return request({
    method: "POST",
    url:'/api/articles',
    data
  });
}

//更新文章
export const updateArticles = (article,slug) => {
  return request({
    method: "PUT",
    url: `/api/articles/${slug}`,
    data:article
  });
}

//删除文章
export const delArticles = slug => {
  return request({
    method: "DELETE",
    url: `/api/articles/${slug}`,
  });
}

//添加文章点赞状态
export const addFavorite = slug => {
  return request({
    method: "POST",
    url: `/api/articles/${slug}/favorite`,
  });
}

//添加文章点赞状态
export const delFavorite = slug => {
  return request({
    method: "DELETE",
    url: `/api/articles/${slug}/favorite`,
  });
};