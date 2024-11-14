import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { getRole } from "@/lib/utils";

const getOrCreateUser = async (profile) => {
  const { email, given_name, family_name } = profile;

  if (!email.endsWith("@scu.edu")) {
    console.error("Login from unauthorized email: ", email);
    return null;
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && !user.profilePictureUrl) {
      user = await prisma.user.update({
        where: { email },
        data: { profilePictureUrl: profile.picture },
      });
    }

    if (!user) {
      const role = getRole(email);
      const newUser = await prisma.user.create({
        data: {
          email,
          role,
          profilePictureUrl: profile.picture,
        },
      });

      const commonData = {
        firstName: given_name,
        lastName: family_name,
        userId: newUser.id,
      };

      if (role === "faculty") {
        await prisma.faculty.create({
          data: { ...commonData, department: "" },
        });
      } else {
        await prisma.student.create({
          data: { ...commonData, major: "" },
        });
      }

      return newUser;
    }

    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const user = await getOrCreateUser(profile);
        if (user) {
          profile.role = user.role;
          profile.picture = user.profilePictureUrl;
        }
        return profile;
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile.email.endsWith("@scu.edu");
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.picture = user.picture;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.image = token.picture;
      return session;
    },
  },
  // pages: {
  //   error: "/auth/error",
  // },
};

export { authOptions };
export default NextAuth(authOptions);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const user = await getOrCreateUser(profile);
        if (user) {
          profile.role = user.role;
          profile.picture = user.profilePictureUrl;
        }
        return profile;
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile.email.endsWith("@scu.edu");
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.picture = user.picture;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      session.user.image = token.picture;
      return session;
    },
  },
  // pages: {
  //   error: "/auth/error",
  // },
});
