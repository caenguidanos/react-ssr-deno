import React, { createElement as h } from "https://esm.sh/react";

import { Route } from "../router.ts";

interface DocumentProps<K = unknown> {
   data: K;
   route: Route;
}

const _Document: React.FunctionComponent<DocumentProps> = ({ route, children, data }) => {
   return (
      <html lang="en">
         <head>
            <meta charSet="utf8" />
            <meta name="viewport" content="width=device-width" />
            <meta name="description" content={route.head.description} />
            <meta name="theme-color" content="#000" />

            <title>{route.head.title}</title>
            <link rel="icon" type="image/png" href="public/favicon.png" />

            {route.head.link?.map((value) => <link href={value.href} rel={value.rel} />)}
         </head>
         <body>
            <div id="__deno">{children}</div>
            <script id="__DENO__" deno-data={data} deno-route={route.path} />
         </body>
      </html>
   );
};

export default _Document;
