import { auth } from 'src/boot/firebase'

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/Users.vue") },
      { path: "/auth", component: () => import("src/pages/Auth.vue") },
      {
        path: "/chat/:from/:to",
        component: () => import("src/pages/Chat.vue"),
        beforeEnter: (to, from, next) => {
          auth.onAuthStateChanged((user) => {
            if (user) {
              console.log("user is logged in | route guard");
              next();
            } else {
              console.log("user logged out | route guard");
              next("/login");
            }
          });
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
