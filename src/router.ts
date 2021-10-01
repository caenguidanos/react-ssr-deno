import Index from "./pages/index.tsx";
import About from "./pages/about/index.tsx";

import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

interface BeforeView {
   props?: unknown;
   redirect?: string;
}

export type BeforeViewRouteSync = (request: Request) => BeforeView;
export type BeforeViewRouteAsync = (request: Request) => Promise<BeforeView>;

interface Route {
   id: string;
   path: string;
   component: React.FunctionComponent<any>;
   beforeView: BeforeViewRouteSync | BeforeViewRouteAsync;
}

export const Router: Route[] = [
   {
      id: nanoid(75),
      path: "/",
      component: Index,
      beforeView: async (_request) => {
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
      beforeView: (request) => {
         return {
            props: {
               name: request.url,
            },
         };
      },
   },
];
