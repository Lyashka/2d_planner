<template>
<div>
  <div>
    <Planner2d/>
  </div>
</div>

</template>

<script setup>

import Planner2d from '/planner2d/src/Planner2d.vue'

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