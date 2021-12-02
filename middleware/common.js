import {getUser} from '@/api/user';

export default async function ({ store, redirect }) {
    // If the user is not authenticated
    const {user}=store.state;
    if(user&&!user.image){
      let {data}=await getUser();
      store.commit('setUser',data.user)
    }
  }