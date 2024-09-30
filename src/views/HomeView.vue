<template>
 <div>
  <CategoryList :categories="categories"/>
 </div>
</template>

<script setup>
import CategoryList from '/category-list/src/category-list.js';

 const categories = [
  { id: 1, name: 'Категория 1', link: '/category1' },
  { id: 2, name: 'Категория 2', link: '/category2' },
]

</script>

<style>
@import '/category-list/src/style.css';
</style>