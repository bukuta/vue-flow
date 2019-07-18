<template>
  <el-form
    ref="form"
    :model="form"
    label-width="80px"
    class="node-form">
    <el-form-item
      label="节点类型"
      prop="component"
    >
      <el-select v-model="form.component">
        <el-option
          v-for="item of components"
          :key="item.name"
          :value="item.name"
          :label="item.description">{{ item.description }}</el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      label="名称"
      prop="name"
    >
      <el-input v-model="form.name"/>
    </el-form-item>

    <el-form-item
      label="说明"
      prop="description"
    >
      <el-input
        v-model="form.description"
        type="textarea"/>
    </el-form-item>

    <el-form-item
      label="赋值"
      prop="assignment"
    >
      <el-input
        v-model="form.assignment"
        type="textarea"/>
    </el-form-item>

    <el-form-item
      label="条件"
      prop="whenText"
    >
      <el-input
        v-model="form.whenText"
        type="textarea"/>
    </el-form-item>

  </el-form>
</template>
<script>

import configs from './configs';

export default {
  name: 'NodeForm',
  data() {
    return {
      components: configs.components,
      form: {
        component: '',
        name: '',
        description: '',
        payload: {},
      },
    };
  },

  methods: {
    validate() {
      return this.$refs.form.validate();
    },
    getValue() {
      return { ...this.form };
    },
  },

};
</script>

<style>

</style>
