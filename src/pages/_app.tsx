import React, { createElement as h } from "https://esm.sh/react";
import * as ReactDom from "https://esm.sh/react-dom";
import { Router } from "../router.ts";

interface AppProps {
   PageProps: unknown;
   Component: React.FunctionComponent<any>;
}

const App: React.FunctionComponent<AppProps> = ({ PageProps, Component }) => {
   return (
      <div>
         <h2>SuperLayout</h2>
         <Component {...PageProps} />
      </div>
   );
};

export default App;

if (globalThis.document) {
   const initialDataScript = globalThis.document.getElementById("__DENO__");

   if (initialDataScript) {
      const initialData: AppProps["PageProps"] = JSON.parse(initialDataScript.getAttribute("deno-data") || "");
      const route: string = initialDataScript.getAttribute("deno-route") || "";

      type WindowDevTools = typeof globalThis & {
         __REACT_DEVTOOLS_GLOBAL_HOOK__: {
            inject: () => void;
         };
      };

      if (typeof (globalThis as unknown as WindowDevTools).__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
         (globalThis as unknown as WindowDevTools).__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = () => {};
      }

      const routeInstance = Router.find((r) => r.path === route);

      if (routeInstance) {
         ReactDom.hydrate(
            <App PageProps={initialData} Component={routeInstance.component} />,
            globalThis.document.getElementById("__deno"),
         );
      }
   }
}
