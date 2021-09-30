import Index from "./pages/index.tsx";
import About from "./pages/about/index.tsx";

import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

export const Router = [
   {
      id: nanoid(75),
      path: "/",
      component: Index,
      beforeView: async () => {
         const response = await fetch("https://jsonplaceholder.typicode.com/users");

         if (response.ok) {
            const users = await response.json();

            return {
               props: {
                  users,
               },
            };
         }

         return {
            props: {
               users: [],
            },
         };
      },
   },
   {
      id: nanoid(75),
      path: "/about",
      component: About,
      beforeView: () => {
         return {
            props: {
               name: "me",
            },
         };
      },
   },
];
