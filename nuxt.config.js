
module.exports = {
    router: {
        linkActiveClass: 'active',
        extendRoutes(routes, resolve) {
            routes.splice(0);
            routes.push(...[
                {
                    path: '/',
                    component: resolve(__dirname,'pages/layout/'),
                    children: [
                        {
                            path: '/',
                            name: 'home',
                            component: resolve(__dirname,'pages/home/'),
                        },
                        {
                            path: '/login',
                            name: 'login',
                            component: resolve(__dirname,'pages/login/'),
                        },
                        {
                            path: '/register',
                            name: 'register',
                            component: resolve(__dirname,'pages/login/'),
                        },
                        {
                            path: '/profile/:username',
                            name: 'profile',
                            component: resolve(__dirname,'pages/profile/'),
                        },
                        {
                            path: '/settings',
                            name: 'settings',
                            component: resolve(__dirname,'pages/settings/'),
                        },
                        {
                            path: '/editor',
                            name: 'editor',
                            component: resolve(__dirname,'pages/editor/'),
                        },
                        {
                            path: '/article/:slug',
                            name: 'article',
                            component: resolve(__dirname,'pages/article/'),
                        },
                    ]
                }
            ]);
        }
    },
    plugins:['~/plugins/request.js','~/plugins/dayjs.js'],
    server:{
        host:'0.0.0.0',
        port:8090,
    },
    head: {
        title: 'conduit',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: 'Meta description' }
        ],
        link: [
            { rel: 'favicon',  href: '/favicon.ico' }
        ],
      }
    // modules: [
    //     // 请求代理配置，解决跨域
    //     '@gauseen/nuxt-proxy',
    // ],
    // proxyTable: {
    //     '/api': { target: 'https://api.realworld.io', ws: false }
    // },
}