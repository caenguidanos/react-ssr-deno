import React, { createElement as h } from "https://esm.sh/react";

interface IndexProps {
   users: unknown[];
}

const Index: React.FunctionComponent<IndexProps> = ({ users }) => {
   if (!users) {
      return <div>Loading....</div>;
   }

   return (
      <div>
         <h3>Index Page</h3>
         <pre>
            <code>
               {JSON.stringify(users, null, 4)}
            </code>
         </pre>
      </div>
   );
};

export default Index;
