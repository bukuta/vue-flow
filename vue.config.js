const debug = require('debug')('yrd-core');
const path = require('path');

const projectRoot = process.cwd();

module.exports = {
  lintOnSave: false,
  configureWebpack: (config) => {
    config.entry.app = ['./example/index.js'];
    config.entry['editor.worker'] = 'monaco-editor/esm/vs/editor/editor.worker.js';
    config.devtool = 'source-map';
    config.output.globalObject = 'self';

    config.resolve.alias = {
      ...config.resolve.alias,
      $src: path.join(projectRoot, 'src'),

      $vue: 'vue/dist/vue.esm.js', // path.join(projectRoot, 'src/packages/vuex/src/index.js'),
      vue$: 'vue/dist/vue.esm.js', // path.join(projectRoot, 'src/packages/vuex/src/index.js'),
    };
    debug(config);
    // return config;
  },
  devServer: {
    proxy: {
      '/api/v1': {
        // target: 'http://127.0.0.1:3303/',
        // target: 'http://127.0.0.1:8888/',
        // pathRewrite: { "^/api/v1": "" },
        // target: "http://10.151.10.132:8080/",
        target: 'http://test.ivr.yrdonline.com/',
        // target: 'http://ivr.yrd.creditease.corp/',
        changeOrigin: true,
      },
    },
  },
};
