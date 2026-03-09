import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import { verifyPassword } from './auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() }
        })

        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        const isValid = await verifyPassword(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar || user.image,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google OAuth: create or update user in database
      if (account?.provider === 'google' && profile?.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email.toLowerCase() }
          })

          if (!existingUser) {
            // Create new user from Google profile
            const newUser = await prisma.user.create({
              data: {
                email: profile.email.toLowerCase(),
                name: profile.name || 'Google User',
                image: (profile as any).picture || null,
                avatar: (profile as any).picture || null,
                emailVerified: new Date(),
              }
            })
            user.id = newUser.id
          } else {
            user.id = existingUser.id
            // Update avatar if not set
            if (!existingUser.avatar && (profile as any).picture) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { 
                  avatar: (profile as any).picture,
                  image: (profile as any).picture,
                }
              })
            }
          }
        } catch (error) {
          console.error('Google sign-in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      // On Google sign-in, ensure we have the DB user id
      if (account?.provider === 'google' && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email.toLowerCase() }
        })
        if (dbUser) {
          token.id = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
