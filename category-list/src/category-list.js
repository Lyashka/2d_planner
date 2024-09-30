import CategoryItem from './category-item.js';

export default {
    name: 'CategoryList',
    props: ['categories'],
    components: {
        CategoryItem
    },
    template: `
    <ul class="category-list">
      <CategoryItem v-for="category in categories" :key="category.id" 
        :name="category.name" :link="category.link">sssd</CategoryItem>
    </ul>
  `
}