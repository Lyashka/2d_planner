import CategoryList from './category-list.js';

// Экспорт компонента CategoryList
export default {
    install(Vue) {
        Vue.component('CategoryList', CategoryList);
    }
};