export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "client",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
      },
    ],
  },

  publicRuntimeConfig: {
    BACKEND_URL:
      process.env.MODE === "development"
        ? process.env.BACKEND_URL_DEV
        : process.env.BACKEND_URL || "http://localhost:3030",
  },
  server: {
    host: "0.0.0.0",
    port: "5000",
  },
  // server: {
  //   host: '0.0.0.0',
  //   port: '10000'
  // },

  css: ["~/assets/main.css"],

  plugins: [{ src: "@/plugins/socket-io.js", ssr: false }],

  components: true,

  buildModules: [],

  modules: ["@nuxtjs/axios"],
  io: {
    sockets: [
      {
        name: "chat",
        url:
          process.env.MODE === "development"
            ? process.env.BACKEND_URL_DEV
            : process.env.BACKEND_URL || "http://localhost:3030",
      },
    ],

    // sockets: [{
    //   name: "chat",
    //   url: "https://awesomechat-api.onrender.com/"
    // }]
  },
  axios: {
    baseURL:
      process.env.MODE === "development"
        ? process.env.BACKEND_URL_DEV
        : process.env.BACKEND_URL || "http://localhost:3030",
  },

  build: {},
};
