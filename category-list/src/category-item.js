export default {
    name: 'CategoryItem',
    props: ['name', 'link'],
    template: `
    <li class="category-item">
      <a :href="link" class="category-link">
        {{ name }}
      </a>
    </li>
  `
}