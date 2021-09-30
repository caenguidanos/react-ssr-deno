import { listenAndServe } from "https://deno.land/std@0.107.0/http/server.ts";
import * as fs from "https://deno.land/std@0.109.0/fs/mod.ts";

import { createElement as h } from "https://esm.sh/react";
import * as ReactDomServer from "https://esm.sh/react-dom/server";
import * as swc from "https://x.nest.land/swc@0.1.4/mod.ts";

import Document from "./pages/_document.tsx";
import App from "./pages/_app.tsx";
import { Router } from "./router.ts";

assignEnvironment();
makeClientBrowserBundle();

listenAndServe(":8080", async (request) => {
   const pathname = request.url.replace("http://localhost:8080", "");

   const isStaticAssetRoute = pathname.match(/public(.*)/gi);
   const isApiFunctionRoute = pathname.match(/api(.*)/gi);
   const isStaticDistRoute = pathname.match(/_deno(.*)/gi);
   const isClientBrowserRoute = pathname.match(/(.*)/gi);

   try {
      if (isStaticAssetRoute) {
         return await handleStaticAssetRoute(request, pathname);
      }

      if (isApiFunctionRoute) {
         return handleApiFunctionRoute(request, pathname);
      }

      if (isStaticDistRoute) {
         return await handleStaticDistRoute(request, pathname);
      }

      if (isClientBrowserRoute) {
         return handleClientBrowserRoute(request, pathname);
      }

      return handleOtherRoute();
   } catch (error) {
      return handleErrorRoute(error);
   }
});

console.log("Listening on port ::8080");

async function handleStaticAssetRoute(_request: Request, pathname: string): Promise<Response> {
   const headers = new Headers();

   headers.append("content-type", "text/html; charset=8");

   const localPath = Deno.cwd() + pathname;
   const buffer = await Deno.readFile(localPath);

   return new Response(buffer, { headers });
}

function handleErrorRoute(error: unknown): Response {
   const headers = new Headers();
   headers.append("content-type", "text/html; charset=8");

   return new Response(error as string, { status: 500, headers });
}

async function handleStaticDistRoute(_request: Request, pathname: string): Promise<Response> {
   const headers = new Headers();

   headers.append("content-type", "application/javascript; charset=8");

   const localPath = Deno.cwd() + pathname;
   const buffer = await Deno.readFile(localPath);

   return new Response(buffer, { headers });
}

function handleApiFunctionRoute(_request: Request, _pathname: string): Response {
   const headers = new Headers();

   headers.append("content-type", "text/plain; charset=8");

   return new Response("API", { headers });
}

async function handleClientBrowserRoute(request: Request, pathname: string): Promise<Response> {
   let ssr: string;
   let initialData: unknown;

   const route = Router.find((r) => r.path === pathname);

   if (route) {
      initialData = {};

      if (route.beforeView) {
         if (route.beforeView.constructor.name === "AsyncFunction") {
            const { props } = await (route.beforeView as any)();
            initialData = props;
         } else {
            const { props } = (route.beforeView as any)();
            initialData = props;
         }
      }

      ssr = ReactDomServer.renderToStaticMarkup(
         <Document initialData={JSON.stringify(initialData)} route={pathname}>
            <App PageProps={initialData} Component={route.component} />
         </Document>,
      ).replace("</body>", `<script src="/_deno/chunks/__bundle.js" defer type="module"></script></body>`);
   } else {
      ssr = ReactDomServer.renderToStaticMarkup(
         <Document initialData="" route={pathname}>
            <p>404</p>
         </Document>,
      );
   }

   const headers = new Headers();
   headers.append("content-type", "text/html; charset=8");

   return new Response(ssr, { headers });
}

function handleOtherRoute() {
   const headers = new Headers();
   headers.append("content-type", "text/plain; charset=8");

   return new Response("NOT FOUND", { status: 404, headers });
}

async function makeClientBrowserBundle() {
   const existsDistFolder = await fs.exists("_deno");

   if (existsDistFolder) {
      await Deno.remove("_deno", { recursive: true });
   }

   await Deno.mkdir("_deno/chunks", { recursive: true });

   const { files, diagnostics } = await Deno.emit("src/pages/_app.tsx", {
      check: false,
      bundle: "module",
      compilerOptions: {
         lib: ["dom", "dom.iterable", "dom.asynciterable", "deno.ns", "deno.unstable"],
      },
   });

   if (diagnostics.length) {
      console.log(diagnostics);
   }

   const bundle: string = files["deno:///bundle.js"];

   const { code: minified } = swc.transform(bundle, {
      minify: true,
      jsc: {
         transform: {
            react: {
               pragma: "h",
               pragmaFrag: "Fragment",
               throwIfNamespace: true,
               development: false,
               useBuiltins: false,
               runtime: "classic",
            },
         },
         minify: {
            compress: {
               unused: true,
            },
            mangle: true,
         },
         parser: {
            syntax: "typescript",
            tsx: true,
         },
         target: "es2016",
      },
   } as any);

   await Deno.writeTextFile("_deno/chunks/__bundle.js", minified);
   await Deno.writeTextFile("_deno/chunks/__bundle.js.map", minified);
}

function assignEnvironment() {
   type GlobalWithProcess = typeof globalThis & {
      process: {
         env: Record<string, string>;
      };
   };

   (globalThis as unknown as GlobalWithProcess).process = {
      env: {
         NODE_ENV: "production",
      },
   };
}
