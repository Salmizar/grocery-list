import { createRouter, createWebHistory } from 'vue-router'

const isAuthenticated = () => {
  return true;
}
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/LoginVue.vue')
    },
    {
      path: '/reset',
      name: 'Reset',
      component: () => import('../views/ResetVue.vue')
    },
    {
      path: '/reset/:id',
      name: 'ResetPassword',
      component: () => import('../views/ResetPassword.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterVue.vue')
    },
    {
      path: '/list/:id',
      name: 'List',
      component: () => import('../views/ListVue.vue'),
      props: true,
      beforeEnter() {
        if (!isAuthenticated()) {
          alert("You must login first");
          return "/";
        }
      }
    },
    {
      path: '/items',
      name: 'Items',
      component: () => import('../views/ItemsVue.vue'),
      beforeEnter() {
        if (!isAuthenticated()) {
          alert("You must login first");
          return "/";
        }
      },
      children: [
        {
          path: '/items/:id',
          name: 'AddEditItem',
          component: () => import('../views/AddEditItem.vue'),
          props: true
        }
      ]
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('../views/CategoriesVue.vue'),
      beforeEnter() {
        if (!isAuthenticated()) {
          alert("You must login first");
          return "/";
        }
      },
      children: [
        {
          path: '/categories/:id',
          name: 'AddEditCategory',
          component: () => import('../views/AddEditCategory.vue'),
          props: true
        }
      ]
    },
    {
      path: '/stores',
      name: 'Stores',
      component: () => import('../views/StoresVue.vue'),
      props: true,
      beforeEnter() {
        if (!isAuthenticated()) {
          alert("You must login first");
          return "/";
        }
      },
      children: [
        {
          path: '/stores/:id',
          name: 'AddEditStore',
          component: () => import('../views/AddEditStore.vue'),
          props: true
        }
      ]
    }
  ]
});

export default router
