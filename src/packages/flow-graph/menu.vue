<template>
  <g class="vue-graph-menu">
    <rect
      :width="1440"
      :height="1440"
      class="context-modal-bg"
      @contextmenu="onOutClick"
      @click="onOutClick"
      @press="onOutClick"
    />
    <g
      :transform="transform"
      class="context-node">
      <g
        v-for="(item, index) of component.inports"
        :key="item.name"
        class="context-ports context-ports-in"
        transform="">
        <g class="context-ports-lines">
          <path
            d="M -23.96519212951442 -11.465547185187631 L -100 0"
            class="context-port-path"/>

        </g>
        <g class="context-ports-ports">
          <g
            class="context-port click context-port-in">
            <rect
              class="context-port-bg"
              x="-220"
              y="-18"
              width="120"
              rx="8"
              ry="8"
              height="35"/>
            <circle
              class="context-port-hole stroke route10"
              cx="-100"
              cy="0"
              r="10"/>
            <text
              class="context-port-label fill route10"
              x="-120"
              y="0">{{ item.name }}</text>
          </g>
        </g>
      </g>
      <g
        v-for="(item, index) of component.outports"
        :key="item.name"
        class="context-ports context-ports-out"
        transform="">
        <g class="context-ports-lines">
          <path
            d="M 33.95667570526233 -11.465547185187631 L 100 0"
            class="context-port-path"/>
        </g>
        <g class="context-ports-ports">
          <g class="context-port click context-port-out">
            <rect
              class="context-port-bg"
              x="100"
              y="-18"
              width="120"
              rx="8"
              ry="8"
              height="35"/>
            <circle
              class="context-port-hole stroke route9"
              cx="100"
              cy="0"
              r="10"/>
            <text
              class="context-port-label fill route9"
              x="120"
              y="0">{{ item.name }}</text>
          </g>
        </g>
      </g>
      <g
        transform="translate(0,0)"
        class="context-menu">
        <g
          :class="{click: hasActionTop}"
          class="context-slice context-node-info"
          @click="onActionClick('top')"
        >
          <path
            d="M 25.455844122715703 -25.455844122715718 A 36 36 0 0 0 -25.455844122715718 -25.45584412271571"
            class="context-arc context-node-info-bg"
          />
          <g v-if="hasActionTop">
            <text
              x="0"
              y="-52"
              class="icon context-icon context-node-info-icon">{{ actionTop.fontIcon }}</text>
            <text
              x="0"
              y="-35"
              class="context-arc-icon-label">{{ actionTop.label }}</text>
          </g>
        </g>
        <g
          :class="{click: hasActionBottom}"
          class="context-slice context-node-info click"
          @click="onActionClick('bottom')"
        >
          <path
            d="M -25.45584412271571 25.455844122715714 A 36 36 0 0 0 25.455844122715714 25.45584412271571"
            class="context-arc context-node-info-bg"
          />
          <g v-if="hasActionBottom">
            <text
              x="0"
              y="52"
              class="icon context-icon context-node-info-icon">{{ actionBottom.fontIcon }}</text>
            <text
              x="0"
              y="35"
              class="context-arc-icon-label">{{ actionBottom.label }}</text>
          </g>
        </g>
        <g
          :class="{click: hasActionRight}"
          class="context-slice context-node-info"
          @click="onActionClick('right')"
        >
          <path
            d="M 25.455844122715714 25.45584412271571 A 36 36 0 0 0 25.455844122715714 -25.45584412271571"
            class="context-arc context-node-info-bg"
          />
          <g v-if="hasActionRight">
            <text
              x="45"
              y="-5"
              class="icon context-icon context-node-info-icon"></text>
            <text
              x="45"
              y="15"
              class="context-arc-icon-label">{{ actionRight.label }}</text>
          </g>
        </g>
        <g
          :class="{click: hasActionRight}"
          class="context-slice context-node-info"
          @click="onActionClick('left')"
        >
          <path
            d="M -25.455844122715718 -25.45584412271571 A 36 36 0 0 0 -25.45584412271571 25.455844122715714"
            class="context-arc context-node-info-bg"
          />
          <g v-if="hasActionLeft">
            <text
              x="-45"
              y="-5"
              class="icon context-icon context-node-info-icon">{{ actionLeft.fontIcon }}</text>
            <text
              x="-45"
              y="15"
              class="context-arc-icon-label">{{ actionLeft.label }}</text>
          </g>
        </g>
        <path
          class="context-circle-x"
          d="M -51 -51 L 51 51 M -51 51 L 51 -51"/>
        <circle
          r="72"
          class="context-circle"/>
        <text
          x="0"
          y="-87"
          class="context-node-label">{{ node.name||node.id||'name-needed' }}</text>
        <rect
          class="context-node-rect"
          x="-24"
          y="-24"
          width="48"
          height="48"
          rx="8"
          ry="8"/>
        <text class="icon context-node-icon"></text>
      </g>
    </g>
  </g>
</template>

<script>
/* eslint-disable max-len */

export default {
  name: 'GraphMenu',
  props: {
    actions: {
      type: Array,
      default() {
        return [
          {
            action: 'left',
            label: 'left',
            icon: 'delete',
            fontIcon: '',
          },
          {
            action: 'right',
            label: 'right',
            icon: 'right',
            fontIcon: '',
          },
          {
            action: 'bottom',
            label: 'bottom',
            icon: 'bottom',
            fontIcon: '',
          },
          {
            action: 'top',
            label: 'top',
            icon: 'top',
            fontIcon: '',
          },
        ];
      },
    },
    component: {
      type: Object,
      default() {
        return {
          name: 'action',
          icon: 'address-book',
          inports: [

          ],
          outports: [

          ],
        };
      },
    },
    nodeType: {
      type: String,
      default: 'node',
    },
    node: {
      type: Object,
      default() {
        return { };
      },
    },
    context: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    transform() {
      const { x, y } = this.context;
      return `translate(${x},${y})`;
    },
    // 1: Bottom
    // 2: Left, Right
    // 3: Left, Right, Bottom
    // 4: Left, Right, Bottom, Top
    hasActionTop() {
      return this.actions.length === 4;
    },
    hasActionRight() {
      return this.actions.length >= 2;
    },
    hasActionBottom() {
      return this.actions.length === 1 || this.actions.length > 2;
    },
    hasActionLeft() {
      return this.actions.length >= 2;
    },
    actionTop() {
      return this.actions[3];
    },
    actionRight() {
      let action = null;
      switch (this.actions.length) {
      case 2:
        action = this.actions[1];
        break;
      case 3:
        action = this.actions[1];
        break;
      case 4:
        action = this.actions[1];
        break;
      default:
        break;
      }
      return action;
    },
    actionBottom() {
      let action = null;
      switch (this.actions.length) {
      case 1:
        action = this.actions[0];
        break;
      case 3:
        action = this.actions[2];
        break;
      case 4:
        action = this.actions[2];
        break;
      default:
        break;
      }
      return action;
    },
    actionLeft() {
      return this.actions[0];
    },
  },

  methods: {
    onOutClick(e) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      this.$emit('context-menu-hidden');
    },
    onActionClick(position) {
      switch (position) {
      case 'top':
        if (this.hasActionTop) {
          this.$emit('menu-action', this.actionTop);
        }
        break;
      case 'bottom':
        if (this.hasActionBottom) {
          this.$emit('menu-action', this.actionBottom);
        }
        break;
      case 'left':
        if (this.hasActionLeft) {
          this.$emit('menu-action', this.actionLeft);
        }
        break;
      case 'right':
        if (this.hasActionRight) {
          this.$emit('menu-action', this.actionRight);
        }
        break;
      default:
        break;
      }
    },
  },

};
</script>

<style lang="less">
.vue-graph-menu{
  .context-modal-bg {
    fill: rgba(0,0,0,0.5);
}
.context-port-path {
    stroke: #bfbfbf;
}
.click {
    cursor: pointer;
}
.context-arc {
    stroke-width: 72px;
    stroke: rgba(43,48,54,0.95);
}
 .context-port-bg {
    fill: rgba(43,48,54,0.95);
}
.context-port-hole {
    stroke-width: 2px;
    fill: rgba(43,48,54,0.95);
    stroke: #bfbfbf;
}
.context-port-in .context-port-label {
    text-anchor: end;
}
.context-port-label {
    fill: #fff;
    dominant-baseline: central;
}
.icon {
    font-family: 'FontAwesomeSVG';
    text-anchor: middle;
    dominant-baseline: central;
}
.context-icon {
    font-size: 20px;
    fill: #fff;
}
.context-arc-icon-label {
    font-size: 12px;
    text-anchor: middle;
    fill: #fff;
}
.context-circle-x {
    stroke: #bfbfbf;
    fill: none;
    stroke-width: 1px;
}
.context-circle {
    stroke: #bfbfbf;
    fill: none;
    stroke-width: 1.5px;
}
.context-node-label {
    text-anchor: middle;
    fill: #fff;
}
.context-node-rect {
    fill: #121417;
    stroke: #bfbfbf;
    stroke-width: 0.5px;
}
.context-node-icon {
    font-size: 30px;
    fill: #fff;
}
.context-slice.click:hover .context-arc {
  stroke: rgba(90,102,114,0.95);
}
}

</style>
