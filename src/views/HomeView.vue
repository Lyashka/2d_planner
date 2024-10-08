<template>
<div>
<!--  <header class="page-header">Header</header>-->
  <div>
<!--    <CategoryList  />-->
    <Test/>
  </div>
</div>

</template>

<script setup>
import CategoryList from '/planner2d/src/planner2d.ts';

import Test from '/planner2d/src/project/test.vue'

</script>

<style>

*{
  margin: 0;
  padding: 0;
}
.page-header{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  width: 100%;
  height: 40px;
  background-color: aqua;
}

</style>