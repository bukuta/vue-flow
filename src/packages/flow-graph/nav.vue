<template>
  <div
    :style="`width:${width}px; height: ${height}px;`"
    class="graph-nav"
  >
    <div
      ref="viewport"
      :style="viewportStyle"
      class="viewport"/>
    <canvas
      ref="thumbs"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import * as ThumbUtils from './the-graph-thumb.js';

export default {
  name: 'GraphNav',
  props: {
    graph: {
      type: Object,
      default() {
        return {};
      },
    },

    width: {
      type: [Number, String],
      default: 200,
    },
    height: {
      type: [Number, String],
      default: 120,
    },

    viewport: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
          scale: 1,
          windowWidth: 100,
          windowHeight: 100,
        };
      },
    },
  },
  data() {
    return {

    };
  },

  computed: {
    viewportStyle() {
      const top = 0;
      const left = 0;
      const width = 0;
      const height = 0;
      return `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`;
    },
  },

  watch: {
    viewport() {
      this.renderThumbnailFromProps();
    },
    graph: {
      deep: true,

      handler() {
        this.renderThumbnailFromProps();
      },
    },
  },

  mounted() {
    this.context = this.$refs.thumbs.getContext('2d');
  },

  methods: {
    renderThumbnailFromProps() {
      console.log('renderThumbailFromProps');
      const props = {
        width: this.width,
        height: this.height,
        viewScale: this.scale,
        lineWidth: 2,
        nodeSize: 72,
      };
      if (this.context) {
        ThumbUtils.render(this.context, this.graph, props);
      }
    },
  },

};
</script>

<style lang="less">
.graph-nav{
    position: absolute;
    right: 0px;
    bottom: 0px;
    overflow: hidden;
    cursor: move;
    background-color: rgba(186, 196, 196, 0.9);
    touch-action: none;
    user-select: none;
    .viewport{
      position: absolute;
      top: 49px;
      left: 85px;
      width: 64px;
      height: 34px;
      border-style: dotted;
      border-width: 1px;
      border-color: rgba(153, 238, 255, 0.4);
    }
}
</style>
