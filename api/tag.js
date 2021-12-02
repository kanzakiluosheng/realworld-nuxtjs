import {request} from "@/plugins/request";

//获取tags
export const getTags = () => {
  return request({
    method: "GET",
    url: "/api/tags"
  });
}