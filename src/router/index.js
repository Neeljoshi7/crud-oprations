import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/Home.vue"),
      meta: {
        pageTitle: "Home",
        breadcrumb: [
          {
            text: "Home",
            active: true,
          },
        ],
      },
    },
    {
      path: "/projects",
      name: "projects",
      component: () => import("@/views/SecondPage.vue"),
      meta: {
        pageTitle: "projects",
        breadcrumb: [
          {
            text: "projects",
            active: true,
          },
        ],
      },
    },
    {
      path: "/employee",
      name: "employee",
      component: () => import("@/views/Employees.vue"),
      meta: {
        pageTitle: "Employee",
        breadcrumb: [
          {
            text: "employee",
            active: true,
          },
        ],
      },
    },
    {
      path: "/viewclient",
      name: "viewclient",
      component: () => import("@/views/ViewClient.vue"),
      meta: {
        pageTitle: "View Client",
        breadcrumb: [
          {
            text: "viewclient",
            active: true,
          },
        ],
      },
    },
    {
      path: "/clients",
      name: "clients",
      component: () => import("@/views/Clients.vue"),
      meta: {
        pageTitle: "Clients",
        breadcrumb: [
          {
            text: "clients",
            active: true,
          },
        ],
      },
    },
    {
      path: "/state",
      name: "state",
      component: () => import("@/views/State.vue"),
      meta: {
        pageTitle: "State",
        breadcrumb: [
          {
            text: "state",
            active: true,
          },
        ],
      },
    },
    {
      path: "/countylist",
      name: "countylist",
      component: () => import("@/views/CountyList.vue"),
      meta: {
        pageTitle: "County List",
        breadcrumb: [
          {
            text: "County List",
            active: true,
          },
        ],
      },
    },
    {
      path: "/statelist",
      name: "statelist",
      component: () => import("@/views/StateList.vue"),
      meta: {
        pageTitle: "State List",
        breadcrumb: [
          {
            text: "State List",
            active: true,
          },
        ],
      },
    },
    {
      path: "/customerlist",
      name: "customerlist",
      component: () => import("@/views/CustomerList.vue"),
      meta: {
        pageTitle: "Customer List",
        breadcrumb: [
          {
            text: "Customer List",
            active: true,
          },
        ],
      },
    },
    {
      path: "/",
      name: "login",
      component: () => import("@/views/Login.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "/error-404",
      name: "error-404",
      component: () => import("@/views/error/Error404.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "*",
      redirect: "error-404",
    },
  ],
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

router.beforeEach((to, from, next)=>{
  let checkToken = () =>{
    if(localStorage.getItem('access_token')){
      return true
    }else{
      return false
    }
  }
  if(to.name != 'login'){
    if(checkToken()){
      next()
    }else{
      next({name : 'login'})
    }
  }
  next()
})

export default router;
