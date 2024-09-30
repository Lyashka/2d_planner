<template>
  <ul class="category-list">
    <CategoryItem v-for="category in categories" :key="category.id"
                  :name="category.name" :link="category.link">sssd</CategoryItem>
  </ul>
</template>

<script setup>
  import CategoryItem from './category-item.js';
</script>

<style>
.category-item {
  /* Стили для отдельных категорий */
}
</style>