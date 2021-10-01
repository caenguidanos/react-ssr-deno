import Index from "./pages/index.tsx";
import About from "./pages/about/index.tsx";

import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

interface BeforeView {
   props?: unknown;
   redirect?: string;
}

export type MiddlewareRouteSync = (request: Request) => BeforeView;
export type MiddlewareRouteAsync = (request: Request) => Promise<BeforeView>;

export interface Route {
   id: string;
   path: string;
   component: React.FunctionComponent<any>;
   middleware: MiddlewareRouteSync | MiddlewareRouteAsync;
   head: {
      title: string;
      description: string;
      link?: { href: string; rel: string }[];
   };
}

export const Router: Route[] = [
   {
      id: nanoid(75),
      path: "/",
      component: Index,
      head: {
         title: "Index page",
         description: "Deno is awesome",
         link: [{
            href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap",
            rel: "stylesheet",
         }],
      },
      middleware: async (_request) => {
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
      head: {
         title: "About page",
         description: "Deno is awesome!!",
      },
      middleware: (request) => {
         return {
            props: {
               name: request.url,
            },
         };
      },
   },
];
