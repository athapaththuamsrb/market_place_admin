if(!self.define){let e,a={};const i=(i,s)=>(i=new URL(i+".js",s).href,a[i]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=a,document.head.appendChild(e)}else e=i,importScripts(i),a()})).then((()=>{let e=a[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(a[n])return;let t={};const o=e=>i(e,n),r={module:{uri:n},exports:t,require:o};a[n]=Promise.all(s.map((e=>r[e]||o(e)))).then((e=>(c(...e),t)))}}define(["./workbox-946f13af"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/1070.676daf12d269e99b.js",revision:"676daf12d269e99b"},{url:"/_next/static/chunks/1372-20389aea3830885e.js",revision:"20389aea3830885e"},{url:"/_next/static/chunks/1485-247ecd4bfc74ffd7.js",revision:"247ecd4bfc74ffd7"},{url:"/_next/static/chunks/3083-ea128737f8ab5274.js",revision:"ea128737f8ab5274"},{url:"/_next/static/chunks/3162-00daf2e23bc9317a.js",revision:"00daf2e23bc9317a"},{url:"/_next/static/chunks/3fff1979-98b0975d81caaa0d.js",revision:"98b0975d81caaa0d"},{url:"/_next/static/chunks/4101-1d976b8f68ae786c.js",revision:"1d976b8f68ae786c"},{url:"/_next/static/chunks/4278-ab503b5940e5c1ce.js",revision:"ab503b5940e5c1ce"},{url:"/_next/static/chunks/4764-7df865f7bf169727.js",revision:"7df865f7bf169727"},{url:"/_next/static/chunks/5644-122deb5ff1f54def.js",revision:"122deb5ff1f54def"},{url:"/_next/static/chunks/607-8ddda9bfb50fec9b.js",revision:"8ddda9bfb50fec9b"},{url:"/_next/static/chunks/6455-2a695b305585b46d.js",revision:"2a695b305585b46d"},{url:"/_next/static/chunks/6526-9510b2ac8655caa1.js",revision:"9510b2ac8655caa1"},{url:"/_next/static/chunks/6563.099381adeb047d8f.js",revision:"099381adeb047d8f"},{url:"/_next/static/chunks/6700-5067de570943f1d0.js",revision:"5067de570943f1d0"},{url:"/_next/static/chunks/7053-fe79fdf7ce9b4d77.js",revision:"fe79fdf7ce9b4d77"},{url:"/_next/static/chunks/7429-6253aef82eff1fc1.js",revision:"6253aef82eff1fc1"},{url:"/_next/static/chunks/7897-f4b9a4299380c7c7.js",revision:"f4b9a4299380c7c7"},{url:"/_next/static/chunks/8065-f83bc7da03723090.js",revision:"f83bc7da03723090"},{url:"/_next/static/chunks/9167-603841bb43bff46e.js",revision:"603841bb43bff46e"},{url:"/_next/static/chunks/9431-fd571d72d36b30eb.js",revision:"fd571d72d36b30eb"},{url:"/_next/static/chunks/9689-63a419c31bf8bce5.js",revision:"63a419c31bf8bce5"},{url:"/_next/static/chunks/framework-4c3194704528425d.js",revision:"4c3194704528425d"},{url:"/_next/static/chunks/main-3e27d1400bec71ac.js",revision:"3e27d1400bec71ac"},{url:"/_next/static/chunks/pages/_app-d8b2d78a85b95d8d.js",revision:"d8b2d78a85b95d8d"},{url:"/_next/static/chunks/pages/_error-12a7be6150ce6d51.js",revision:"12a7be6150ce6d51"},{url:"/_next/static/chunks/pages/account-9792cf0ef2b569c2.js",revision:"9792cf0ef2b569c2"},{url:"/_next/static/chunks/pages/account/collection-c376ebcea13dc2e8.js",revision:"c376ebcea13dc2e8"},{url:"/_next/static/chunks/pages/account/collection/create-7e45529107e671fe.js",revision:"7e45529107e671fe"},{url:"/_next/static/chunks/pages/account/edit-a714524981ac2fa3.js",revision:"a714524981ac2fa3"},{url:"/_next/static/chunks/pages/account/view-offers-778d9ef6ac39c104.js",revision:"778d9ef6ac39c104"},{url:"/_next/static/chunks/pages/admin-36f55066cf745b45.js",revision:"36f55066cf745b45"},{url:"/_next/static/chunks/pages/admin/analysis-0f77dbe76426162e.js",revision:"0f77dbe76426162e"},{url:"/_next/static/chunks/pages/admin/report/collection-d63a9f2967269bcb.js",revision:"d63a9f2967269bcb"},{url:"/_next/static/chunks/pages/admin/report/nft-8f27d73c9923d2b5.js",revision:"8f27d73c9923d2b5"},{url:"/_next/static/chunks/pages/admin/report/users-400ad879035bd091.js",revision:"400ad879035bd091"},{url:"/_next/static/chunks/pages/admin/user/%5Bid%5D-f22cc5b4a63807c2.js",revision:"f22cc5b4a63807c2"},{url:"/_next/static/chunks/pages/admin/viewAdmin-edc0c25f3b7d3171.js",revision:"edc0c25f3b7d3171"},{url:"/_next/static/chunks/pages/create-034f3d5ae2569fe0.js",revision:"034f3d5ae2569fe0"},{url:"/_next/static/chunks/pages/explore-collections-cf12362150f08745.js",revision:"cf12362150f08745"},{url:"/_next/static/chunks/pages/index-a9d2b80caa914fcd.js",revision:"a9d2b80caa914fcd"},{url:"/_next/static/chunks/pages/view-c4d25c69184bc895.js",revision:"c4d25c69184bc895"},{url:"/_next/static/chunks/pages/view/collection-393650fe2b7ca55c.js",revision:"393650fe2b7ca55c"},{url:"/_next/static/chunks/pages/view/collection/%5BcollectionId%5D-76752d4ff747fa8c.js",revision:"76752d4ff747fa8c"},{url:"/_next/static/chunks/pages/view/nft-133db2637bf4d6c8.js",revision:"133db2637bf4d6c8"},{url:"/_next/static/chunks/pages/view/nft/%5BownerId%5D-3cdaa09777563cd4.js",revision:"3cdaa09777563cd4"},{url:"/_next/static/chunks/pages/view/nft/%5BownerId%5D/%5BnftId%5D-ce81b7e3103b19e2.js",revision:"ce81b7e3103b19e2"},{url:"/_next/static/chunks/pages/view/nft/%5BownerId%5D/%5BnftId%5D/set-sell-value-e1bd20a7012527e4.js",revision:"e1bd20a7012527e4"},{url:"/_next/static/chunks/pages/view/user-023f71975a8c0498.js",revision:"023f71975a8c0498"},{url:"/_next/static/chunks/pages/view/user/%5BuserId%5D-e407bed0382518d2.js",revision:"e407bed0382518d2"},{url:"/_next/static/chunks/polyfills-5cd94c89d3acac5f.js",revision:"99442aec5788bccac9b2f0ead2afdd6b"},{url:"/_next/static/chunks/webpack-f7d74abe848267d7.js",revision:"f7d74abe848267d7"},{url:"/_next/static/css/60cc7a5bc94f7d5b.css",revision:"60cc7a5bc94f7d5b"},{url:"/_next/static/media/roboto-all-300-normal.39add8fb.woff",revision:"39add8fb"},{url:"/_next/static/media/roboto-all-400-normal.2e9e9400.woff",revision:"2e9e9400"},{url:"/_next/static/media/roboto-all-500-normal.d96daa81.woff",revision:"d96daa81"},{url:"/_next/static/media/roboto-all-900-normal.c54d2563.woff",revision:"c54d2563"},{url:"/_next/static/media/roboto-cyrillic-300-normal.88798412.woff2",revision:"88798412"},{url:"/_next/static/media/roboto-cyrillic-400-normal.2d9c9d60.woff2",revision:"2d9c9d60"},{url:"/_next/static/media/roboto-cyrillic-500-normal.aa68ea54.woff2",revision:"aa68ea54"},{url:"/_next/static/media/roboto-cyrillic-900-normal.321ff2e7.woff2",revision:"321ff2e7"},{url:"/_next/static/media/roboto-cyrillic-ext-300-normal.cd7c5715.woff2",revision:"cd7c5715"},{url:"/_next/static/media/roboto-cyrillic-ext-400-normal.d7827ae3.woff2",revision:"d7827ae3"},{url:"/_next/static/media/roboto-cyrillic-ext-500-normal.a1b5c90d.woff2",revision:"a1b5c90d"},{url:"/_next/static/media/roboto-cyrillic-ext-900-normal.86c8a736.woff2",revision:"86c8a736"},{url:"/_next/static/media/roboto-greek-300-normal.25dc89b0.woff2",revision:"25dc89b0"},{url:"/_next/static/media/roboto-greek-400-normal.63e6dc18.woff2",revision:"63e6dc18"},{url:"/_next/static/media/roboto-greek-500-normal.533b03d2.woff2",revision:"533b03d2"},{url:"/_next/static/media/roboto-greek-900-normal.9f4d93bc.woff2",revision:"9f4d93bc"},{url:"/_next/static/media/roboto-greek-ext-300-normal.bc5ce703.woff2",revision:"bc5ce703"},{url:"/_next/static/media/roboto-greek-ext-400-normal.2b547ded.woff2",revision:"2b547ded"},{url:"/_next/static/media/roboto-greek-ext-500-normal.7ea6cffa.woff2",revision:"7ea6cffa"},{url:"/_next/static/media/roboto-greek-ext-900-normal.6f02620e.woff2",revision:"6f02620e"},{url:"/_next/static/media/roboto-latin-300-normal.a4eae32d.woff2",revision:"a4eae32d"},{url:"/_next/static/media/roboto-latin-400-normal.f2894edc.woff2",revision:"f2894edc"},{url:"/_next/static/media/roboto-latin-500-normal.3170fd9a.woff2",revision:"3170fd9a"},{url:"/_next/static/media/roboto-latin-900-normal.2f95c19e.woff2",revision:"2f95c19e"},{url:"/_next/static/media/roboto-latin-ext-300-normal.37d4965d.woff2",revision:"37d4965d"},{url:"/_next/static/media/roboto-latin-ext-400-normal.21abc8c8.woff2",revision:"21abc8c8"},{url:"/_next/static/media/roboto-latin-ext-500-normal.85ebfb55.woff2",revision:"85ebfb55"},{url:"/_next/static/media/roboto-latin-ext-900-normal.60a74847.woff2",revision:"60a74847"},{url:"/_next/static/media/roboto-vietnamese-300-normal.b3d3e960.woff2",revision:"b3d3e960"},{url:"/_next/static/media/roboto-vietnamese-400-normal.c95fc061.woff2",revision:"c95fc061"},{url:"/_next/static/media/roboto-vietnamese-500-normal.7f8c0554.woff2",revision:"7f8c0554"},{url:"/_next/static/media/roboto-vietnamese-900-normal.def30111.woff2",revision:"def30111"},{url:"/_next/static/p45ZJc9b22aE2dLk7tBlM/_buildManifest.js",revision:"6ef811b6f3eb930f60629b6b8e01da35"},{url:"/_next/static/p45ZJc9b22aE2dLk7tBlM/_middlewareManifest.js",revision:"fb2823d66b3e778e04a3f681d0d2fb19"},{url:"/_next/static/p45ZJc9b22aE2dLk7tBlM/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/android-chrome-512x512.png",revision:"1cc5825a7aaaeaf73605345907ba40c7"},{url:"/d.ico",revision:"eaa91e0b039f94f41ddcfbba107e952f"},{url:"/db5dbf90c8c83d650e1022220b4d707e.jpg",revision:"eaf62dca970eea87611ab0ca20c03f49"},{url:"/default-avatar-profile-icon-vector-default-avatar-profile-icon-vector-social-media-user-image-vector-illustration-227787227.jpg",revision:"9616f533f2174933ec04cc74164108f9"},{url:"/eethereum.png",revision:"0cf4ae57d9aa8871bc679b415b56a7ee"},{url:"/ethereum.png",revision:"af30c9a149713420bf8d8288b9a43a8c"},{url:"/ethereum1.png",revision:"838023fa6802550a6ed4f7d9bf0544fd"},{url:"/exclusives_logo.png",revision:"20e31c8623e047ea426c9be77da5081c"},{url:"/exclusives_new_logo-removebg.png",revision:"cbe2518224df3a0181bb5dc9ee3810b7"},{url:"/exclusives_new_logo.ico",revision:"bd30d9729de2f1879a96609b932fd0ea"},{url:"/exclusives_new_logo.png",revision:"bd30d9729de2f1879a96609b932fd0ea"},{url:"/favicon.ico",revision:"3827769b564787294297965a98600875"},{url:"/icon-192x192.png",revision:"c6a4da87f021b46270e8e8216dca3dd2"},{url:"/icon-256x256.png",revision:"c9f686cf985d0ddc2007c59e1897f492"},{url:"/icon-384x384.png",revision:"2c311cb9b932d3348e3fc665bdf79f8d"},{url:"/icon-512x512.png",revision:"cd1fe4c4f350f871ad778799d211b578"},{url:"/logo-background.png",revision:"942564d9dad30bf7fa0b145279046079"},{url:"/manifest.json",revision:"d8dd23cebeba021520546e79168e6810"},{url:"/maskable_icons/maskable_icon.png",revision:"5b558d7cd1c459864b93a5ae57ec3a74"},{url:"/maskable_icons/maskable_icon_x128.png",revision:"62619133fc86d4ea41b2561d2b11cb34"},{url:"/maskable_icons/maskable_icon_x192.png",revision:"b46c508bd23193fd3893f90f3696035d"},{url:"/maskable_icons/maskable_icon_x384.png",revision:"885d282b1338c24baeaffdacec5e9f73"},{url:"/maskable_icons/maskable_icon_x48.png",revision:"ddf7bcbede28b23ceae4cb105ea3fe56"},{url:"/maskable_icons/maskable_icon_x72.png",revision:"25f06077fb02c28132e141b9b44105ad"},{url:"/maskable_icons/maskable_icon_x96.png",revision:"8db28fa314dc6cdcfdcf444490175ce5"},{url:"/vercel.svg",revision:"26bf2d0adaf1028a4d4c6ee77005e819"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:i,state:s})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
