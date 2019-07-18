const projectRoot = process.cwd();
const path = require('path');

module.exports = {
  "extends": [
    // "eslint:recommended",
    "airbnb",
    'plugin:vue/recommended',
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": 2018,
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".vue"] }],
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "no-plusplus":[ "warn",{
      "allowForLoopAfterthoughts": true
    }],
    "semi": [
      "error",
      "always"
    ],
    "no-unused-vars": ["error", { "vars": "local", "args": "none", "ignoreRestSiblings": false }],
    "prefer-arrow-callback": [
      "error",
      {
        "allowNamedFunctions": true,
        "allowUnboundThis": false
      }
    ],
    "react/jsx-filename-extension": [
      1,
      { "extensions": [".js", ".jsx"] }
    ],
    "react/react-in-jsx-scope":[
      0,
      {}
    ],
    "react/jsx-no-bind": [1, {
      "ignoreDOMComponents":  false,
      "ignoreRefs": false,
      "allowArrowFunctions": false,
      "allowFunctions": false,
      "allowBind": false
    }],
    "vue/order-in-components": ["error", {
      "order": [
        "el",
        "name",
        "parent",
        "functional",
        ["delimiters", "comments"],
        ["components"],
        "extends",
        "mixins",
        "inheritAttrs",
        "model",
        ["props", "propsData"],
        "data",
        "computed",
        "watch",
        "LIFECYCLE_HOOKS",
        "methods",
        ["template", "render"],
        "renderError",
        [ "directives", "filters"],
      ]
    }],
    "prefer-destructuring": [
      "error", {
        "array": false,
        "object": false
      }, {
        "enforceForRenamedProperties": false
      }],
      "prefer-const": ["error", {
        "destructuring": "all",
        "ignoreReadBeforeAssign": false
      }],
      'no-param-reassign': ["warn", { "props": false }],
      "no-underscore-dangle":[
        "warn",
        {
          allowAfterThis:true,
          allowAfterSuper:true,
          enforceInMethodNames: true,
        }
      ],
      "no-use-before-define": ["error", { "functions": false, "classes": false }]


      // "camelcase":[
      //   "error",
      //   // "always"
      //   {
      //     ignoreDestructuring: true
      //   }
      // ]
      },
      "plugins": [
        // ["module-resolver", {
        //   "root": ["./"],
        //   extensions: [".js", ".vue"],
        //   "alias": {
        //     "$components": "./src/views/components/",
        //     "$domains": "./src/services/domains",
        //     "$src": "./src",
        //     "$vue": "vue",
        //     "$service": "./src/services",
        //   }
        // }]
      ],
      "settings": {
        "import/resolver": {
          "webpack": {
            config: {
              resolve: {
                extensions: [
                  ".js",
                  ".jsx",
                  ".vue",
                ],
                alias: {
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
                }
              }
            }
          }
        }
      }
      };
