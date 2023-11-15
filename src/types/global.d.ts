import "react-router-dom";

declare module "react-router-dom" {
   interface IndexRouteObject {
      baseBackground?: string;
   }
   interface NonIndexRouteObject {
      baseBackground?: string;
   }
}
