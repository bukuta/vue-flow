<template>
  <g
    transform="translate(-40,-60)"
    class="group">
    <rect
      :x="group.metadata.limits.minX"
      :y="group.metadata.limits.minY"
      :width="group.metadata.limits.width"
      :height="group.metadata.limits.height"
      class="group-box color0"
      rx="8"
      ry="8"/>
    <text
      :x="group.metadata.limits.minX+10"
      :y="group.metadata.limits.minY+10"
      class="group-label">{{ group.name }}</text>
    <text
      :x="group.metadata.limits.minX+10"
      :y="group.metadata.limits.minY+30"
      class="group-description">{{ group.metadata.description }}</text>
    <rect
      :x="group.metadata.limits.minX"
      :y="group.metadata.limits.minY"
      class="eventcatcher drag"
      width="144"
      height="48"/>
  </g>
</template>

<script>
export default {
  name: 'GraphGroup',
  props: {
    group: {
      type: Object,
      default() {
        return {
          metadata: {
            name: '',
            description: '',
            limits: {
              minX: 0,
              minY: 0,
              width: 0,
              height: 0,
            },
          },
        };
      },
    },
  },
  data() {
    return {};
  },

};
</script>

<style>

</style>
