// Edge-compatible auth config — no providers with DB access here.
// middleware.js uses this directly; auth.js (below) extends it with the
// Credentials provider for everywhere else (API routes, server components).
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  providers: [],
};
