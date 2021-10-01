import React, { createElement as h } from "https://esm.sh/react";

interface DocumentProps<K = unknown> {
   data: K;
   route: string;
}

const _Document: React.FunctionComponent<DocumentProps> = ({ route, children, data }) => {
   return (
      <html lang="es">
         <head>
            <meta charSet="utf8" />

            <title>SSR Deno</title>
         </head>
         <body>
            <div id="__deno">{children}</div>

            <script id="__DENO__" deno-data={data} deno-route={route} />
         </body>
      </html>
   );
};

export default _Document;
