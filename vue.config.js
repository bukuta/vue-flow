const debug = require('debug')('yrd-core');
const path = require('path');

const projectRoot = process.cwd();

module.exports = {
  lintOnSave: false,
  configureWebpack: (config) => {
    config.entry.app = ['./src/index.js'];
    config.entry['editor.worker'] = 'monaco-editor/esm/vs/editor/editor.worker.js';
    config.devtool = 'source-map';
    config.output.globalObject = 'self';

    config.resolve.alias = {
      ...config.resolve.alias,
      $src: path.join(projectRoot, 'src'),

      $configs: path.join(projectRoot, 'src/configs'),
      $services: path.join(projectRoot, 'src/services'),
      $store: path.join(projectRoot, 'src/store'),
      $util: path.join(projectRoot, 'src/util'),
      $assets: path.join(projectRoot, 'src/assets'),

      $views: path.join(projectRoot, 'src/views'),
      $components: path.join(projectRoot, 'src/views/components'),
      $pages: path.join(projectRoot, 'src/views/pages'),
      $styles: path.join(projectRoot, 'src/views/styles'),
      $resources: path.join(projectRoot, 'src/views/resource'),
      $domains: path.join(projectRoot, 'src/services/domains'),
      $mould: path.join(projectRoot, 'src/packages/mould/src'),
      $yard: path.join(projectRoot, 'src/packages/yard'),
      '$vuex-util': path.join(projectRoot, 'src/packages/vuex-util'),
      '$vuex-templates': path.join(
        projectRoot,
        'src/packages/vuex-util/templates',
      ),
      vuex: path.join(projectRoot, 'src/packages/vuex/src/index.js'),
      $vue: 'vue/dist/vue.esm.js', // path.join(projectRoot, 'src/packages/vuex/src/index.js'),
      vue$: 'vue/dist/vue.esm.js', // path.join(projectRoot, 'src/packages/vuex/src/index.js'),
    };
    debug(config);
    // return config;
  },
  devServer: {
    proxy: {
      '/api/v1/log': {
        target: 'http://10.151.10.132:8080/',
        changeOrigin: true,
        pathRewrite: { '^/api/v1/log': '' },
      },
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
