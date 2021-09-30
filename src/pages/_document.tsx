import React, { createElement as h } from "https://esm.sh/react";

interface DocumentProps<K = unknown> {
   initialData: K;
   route: string;
}

const _Document: React.FunctionComponent<DocumentProps> = ({ route, children, initialData }) => {
   return (
      <html lang="es">
         <head>
            <meta charSet="utf8" />

            <title>SSR Deno</title>
         </head>
         <body>
            <div id="__deno">{children}</div>
            <script id="__DENO__" deno-data={initialData} deno-route={route}></script>

            <script src="/_deno/bundle.js" defer type="module"></script>
         </body>
      </html>
   );
};

export default _Document;
