
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
        port:9991,
    }
    // modules: [
    //     // 请求代理配置，解决跨域
    //     '@gauseen/nuxt-proxy',
    // ],
    // proxyTable: {
    //     '/api': { target: 'https://api.realworld.io', ws: false }
    // },
}