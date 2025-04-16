import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add your own logic for authenticating here
        // Return null if user data could not be retrieved
        const user = { id: "1", name: "Admin" };
        return user;
      }
    })
    // Add other providers as needed
  ],
  pages: {
    signIn: '/auth/signin',
  }
});

export { handler as GET, handler as POST };
