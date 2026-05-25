import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/home/:path*", "/pavti/:path*", "/expense/:path*", "/reports/:path*"],
};
