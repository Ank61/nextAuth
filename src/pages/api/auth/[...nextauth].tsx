
import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { Client } from "postmark";

const dummyTest = {
    userName: 'Ankit',
    password: 'ankit'
}

const postmarkClient = new Client(process.env.POSTMARK_API_TOKEN || "")
export const authOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || '',
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            // @ts-ignore
             async authorize(credentials: any) {
                 const { email, password }: any = credentials;
            //     const response = await fetch('http://localhost:3000/api/routes/login', {
            //         method: 'POST',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({ auth: { email, password } })
            //     })
            //     if (!response.ok) {
            //        return false
            //     }
            //     return true;
                if (email === 'ankit' && password === 'ankit') {
                    return true;
                } else {
                    return null;
                }
             }
        }),
    ],
    callbacks: {
        async signIn(data: any) {
            const { user, account, profile, email, credentials } = data;
            return true
        },
        async session(data: any) {
            const { session, user, token } = data;
            return session
        },
        async jwt(data: any) {
            const { token, user, account, profile, isNewUser } = data
            return token
        }
    }
}
export default NextAuth(authOptions)
