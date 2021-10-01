import React, { createElement as h } from "https://esm.sh/react";
import * as ReactDom from "https://esm.sh/react-dom";
import { Route, Router } from "../router.ts";

interface AppProps {
   PageProps: unknown;
   Component: React.FunctionComponent<any>;
}

const App: React.FunctionComponent<AppProps> = ({ PageProps, Component }) => {
   return (
      <main>
         <h2>SuperLayout</h2>

         <Component {...PageProps} />
      </main>
   );
};

export default App;

if (globalThis.document) {
   const dataScript = globalThis.document.getElementById("__DENO__");

   if (dataScript) {
      const data: AppProps["PageProps"] = JSON.parse(dataScript.getAttribute("deno-data") || "");
      const route: string = dataScript.getAttribute("deno-route") as string;

      const routeInstance = Router.find((r) => r.path === route);

      if (routeInstance) {
         ReactDom.hydrate(
            <App PageProps={data} Component={routeInstance.component} />,
            globalThis.document.getElementById("__deno"),
         );
      }
   }
}
