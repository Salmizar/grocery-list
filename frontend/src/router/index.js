import { createRouter, createWebHistory } from 'vue-router';
const isAuthenticated = () => {
  return !!window.$cookies.isKey('user_id') || !!window.$cookies.isKey('account_id') || !!window.$cookies.isKey('auth_id') || '/';
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
      component: () => import('../views/ResetPassword.vue'),
      props: true,
      beforeEnter() {
        return true;
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterVue.vue'),
      props: true,
      children: [
        {
          path: '/register/:id',
          name: 'Register',
          component: () => import('../views/RegisterVue.vue'),
          beforeEnter(to) {
            return (to.query.email!==undefined && to.query.auth_id!==undefined && !isNaN(Number(to.query.account_id)) && !isNaN(Number(to.params.id))) || '/';
          }
        }
      ]
    },
    {
      path: '/lists',
      name: 'Lists',
      component: () => import('../views/ListVue.vue'),
      props: true,
      beforeEnter() {
        return isAuthenticated();
      }
    },
    {
      path: '/items',
      name: 'Items',
      component: () => import('../views/ItemsVue.vue'),
      props: true,
      beforeEnter() {
        return isAuthenticated();
      },
      children: [
        {
          path: '/items/:id',
          name: 'AddEditItem',
          component: () => import('../views/AddEditItem.vue'),
          beforeEnter() {
        return isAuthenticated();
          }
        }
      ]
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('../views/CategoriesVue.vue'),
      props: true,
      beforeEnter() {
        return isAuthenticated();
      },
      children: [
        {
          path: '/categories/:id',
          name: 'AddEditCategory',
          component: () => import('../views/AddEditCategory.vue'),
          beforeEnter() {
        return isAuthenticated();
          }
        }
      ]
    },
    {
      path: '/stores',
      name: 'Stores',
      component: () => import('../views/StoresVue.vue'),
      props: true,
      beforeEnter() {
        return isAuthenticated();
      },
      children: [
        {
          path: '/stores/:id',
          name: 'AddEditStore',
          component: () => import('../views/AddEditStore.vue'),
          beforeEnter() {
        return isAuthenticated();
          }
        }
      ]
    }
  ]
});

export default router
