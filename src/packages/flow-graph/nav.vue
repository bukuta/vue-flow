<template>
  <!-- <div
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
  </div> -->
  
  <div :style="wrapperStyle" class="graph-nav" ref="topelement">
    <div
      ref="viewboxelement"
      :style="viewboxDiv"
    />
    <canvas
      ref="viewbox"
      :style="thumbStyle"
      :width="options.width"
      :height="options.height"
    />
    <canvas
      ref="thumbs"
      :style="thumbStyle"
      :width="options.width"
      :height="options.height"
    />
  </div>
</template>

<script>
// import * as ThumbUtils from './the-graph-thumb.js';
// import * as NavUtils from './the-graph-nav.js';

import Hammer from 'hammerjs';
import * as thumb from './the-graph-thumb';

function renderViewRectangle(context, viewrect, props) {
  context.clearRect(0, 0, props.width, props.height);
  context.fillStyle = props.outsideFill;

  // Scaled view rectangle
  let x = Math.round(
    (props.viewrectangle[0] / props.scale - props.thumbrectangle[0]) * props.thumbscale,
  );
  let y = Math.round(
    (props.viewrectangle[1] / props.scale - props.thumbrectangle[1]) * props.thumbscale,
  );
  let w = Math.round((props.viewrectangle[2] * props.thumbscale) / props.scale);
  let h = Math.round((props.viewrectangle[3] * props.thumbscale) / props.scale);

  let hide = false;
  if (x < 0 && y < 0 && w > props.width - x && h > props.height - y) {
    // Hide map
    hide = true;
    return {
      hide,
    };
  }
  // Show map
  hide = false;


  // Clip to bounds
  // Left
  if (x < 0) {
    w += x;
    x = 0;
    viewrect.style.borderLeftColor = props.viewBoxBorder2;
  } else {
    viewrect.style.borderLeftColor = props.viewBoxBorder;
    context.fillRect(0, 0, x, props.height);
  }
  // Top
  if (y < 0) {
    h += y;
    y = 0;
    viewrect.style.borderTopColor = props.viewBoxBorder2;
  } else {
    viewrect.style.borderTopColor = props.viewBoxBorder;
    context.fillRect(x, 0, w, y);
  }
  // Right
  if (w > props.width - x) {
    w = props.width - x;
    viewrect.style.borderRightColor = props.viewBoxBorder2;
  } else {
    viewrect.style.borderRightColor = props.viewBoxBorder;
    context.fillRect(x + w, 0, props.width - (x + w), props.height);
  }
  // Bottom
  if (h > props.height - y) {
    h = props.height - y;
    viewrect.style.borderBottomColor = props.viewBoxBorder2;
  } else {
    viewrect.style.borderBottomColor = props.viewBoxBorder;
    context.fillRect(x, y + h, w, props.height - (y + h));
  }

  // Size and translate rect
  viewrect.style.left = `${x}px`;
  viewrect.style.top = `${y}px`;
  viewrect.style.width = `${w}px`;
  viewrect.style.height = `${h}px`;

  return {
    hide,
  };
}

function renderThumbnailFromProps(context, props, graph) {
  const style = {};
  for (const name in props) {
    style[name] = props[name];
  }
  style.graph = null;
  style.lineWidth = props.nodeLineWidth;
  const info = thumb.render(context, graph, style);
  return info;
}
function renderViewboxFromProps(context, viewbox, thumbInfo, props) {
  const style = {};
  for (const name in props) {
    style[name] = props[name];
  }
  style.graph = null;
  style.scale = props.viewscale;
  const thumbW = thumbInfo.rectangle[2];
  const thumbH = thumbInfo.rectangle[3];
  style.thumbscale = thumbW > thumbH ? props.width / thumbW : props.height / thumbH;
  style.thumbrectangle = thumbInfo.rectangle;
  const info = renderViewRectangle(context, viewbox, style);
  return info;
}

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

    options: {
      type: Object,
      default() {
        return {
          width: 200,
          height: 150,
          hidden: false, // FIXME: drop??
          backgroundColor: 'hsla(184, 8%, 75%, 0.9)',
          outsideFill: 'hsla(0, 0%, 0%, 0.4)',
          nodeSize: 60,
          nodeLineWidth: 1,
          viewrectangle: [0, 0, 0, 0],
          viewscale: 1.0,
          viewBoxBorder: 'hsla(190, 100%, 80%, 0.4)',
          viewBoxBorder2: 'hsla( 10,  60%, 32%, 0.3)',
          viewBoxBorderStyle: 'solid',
          graph: {}, // NOTE: should not attach to events, that is responsibility of outer code
        };
      },
    },
  },
  data() {
    return {
      thumbscale: 1.0,
      currentPan: [0.0, 0.0],
    };
  },

  // computed: {
  //   viewportStyle() {
  //     const top = 0;
  //     const left = 0;
  //     const width = 0;
  //     const height = 0;
  //     return `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`;
  //   },
  // },

  computed: {
    wrapperStyle() {
      return `height:${this.options.height}px;width: ${this.options.width}px;backgroundColor:${this.options.backgroundColor};`;
    },
    thumbStyle() {
      return 'position:absolute;bottom:0;right:0';
    },
    viewboxDiv() {
      return `position:absolute;bottom:0;right:0;width:${this.options.width}px;height:${this.options.height}px;border-style:dotted;border-width:1px;`;
    },
  },

  watch: {
    viewport() {
      // this.renderThumbnailFromProps();
      this.updatePan();
      this.renderElements();
    },
    graph: {
      deep: true,

      handler() {
        this.updatePan();
        this.renderElements();
        // this.renderThumbnailFromProps();
      },
    },
  },

  mounted() {
    this.thumbContext = this.$refs.thumbs.getContext('2d');
    this.viewboxContext = this.$refs.viewbox.getContext('2d');
    this.viewboxElement = this.$refs.viewboxelement;
    this.topElement = this.$refs.topelement;

    this.updatePan();
    this.renderElements();
    this.setupEvents();
  },

  methods: {
    // renderThumbnailFromProps() {
    //   console.log('renderThumbailFromProps');
    //   const props = {
    //     width: this.width,
    //     height: this.height,
    //     viewScale: this.scale,
    //     lineWidth: 2,
    //     nodeSize: 72,
    //   };
    //   if (this.context) {
    //     ThumbUtils.render(this.context, this.graph, props);
    //   }
    // },

    renderElements() {
      const t = renderThumbnailFromProps(this.thumbContext, this.options, this.graph);
      // this.thumbscale = t.scale;
      renderViewboxFromProps(this.viewboxContext, this.viewboxElement, t, this.options);
    },
    updatePan() {
      this.currentPan = [-this.options.viewrectangle[0], -this.options.viewrectangle[1]];
    },
    setupEvents() {
      this.hammer = new Hammer.Manager(this.topElement, {
        recognizers: [[Hammer.Tap], [Hammer.Pan, { direction: Hammer.DIRECTIONALL }]],
      });
      console.log(this.hammer)
      this.hammer.on(
        'tap',
        (event) => {
          if (this.options.onTap) {
            this.options.onTap(null, event);
          }
        },
      );
      this.hammer.on(
        'panmove',
        (event) => {
          if (this.options.onPanTo) {
          // Calculate where event pans to, in editor coordinates
            let x = this.currentPan[0];
            let y = this.currentPan[1];
            const panscale = this.thumbscale / this.options.viewscale;
            x -= event.deltaX / panscale;
            y -= event.deltaY / panscale;
            const panTo = { x: Math.round(x), y: Math.round(y) };
            // keep track of the current pan, because prop/component update
            // may be delayed, or never arrive.
            this.currentPan[0] = panTo.x;
            this.currentPan[1] = panTo.y;
            this.options.onPanTo(panTo, event);
          }
        },
      );
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
