import Index from "./pages/index.tsx";

export const Router = [
   {
      path: "/",
      component: Index,
      beforeView: async () => {
         const response = await fetch("https://jsonplaceholder.typicode.com/users");

         if (response.ok) {
            const users = await response.json();

            return { users };
         }
      },
   },
];
