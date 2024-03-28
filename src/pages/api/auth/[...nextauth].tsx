
import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { siteConfig } from "@/config/site";
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
                console.log("Getting", credentials)
                if (email === 'ankit' && password === 'ankit') {
                    return true;
                } else {
                    return null;
                }
            }
        }),
        EmailProvider({
            from: process.env.SMTP_FROM,
            sendVerificationRequest: async (data) => {
                console.log("EMail Sendt",data);
                const { identifier, url, provider, token } = data;
                try {

                    // Ensure provider is defined
                    if (!provider) {
                        throw new Error("Provider object is undefined");
                    }

                    // Ensure provider.from is defined
                    const fromEmail = provider.from as string;
                    if (!fromEmail) {
                        throw new Error("From email address is undefined");
                    }

                    const isVerified :any= await isEmailVerified(identifier, token);


                    const templateId = isVerified?.emailVerified
                        ? process.env.POSTMARK_SIGN_IN_TEMPLATE
                        : process.env.POSTMARK_ACTIVATION_TEMPLATE;
                    if (!templateId) {
                        throw new Error("Missing template id");
                    }

                    const result = await postmarkClient.sendEmailWithTemplate({
                        TemplateId: parseInt(templateId),
                        To: identifier,
                        From: fromEmail,
                        TemplateModel: {
                            action_url: url,
                            product_name: siteConfig.name,
                        },
                        Headers: [
                            {
                                Name: "X-Entity-Ref-ID",
                                Value: new Date().getTime() + "",
                            },
                        ],
                    });

                    if (result.ErrorCode) {
                        throw new Error(result.Message);
                    }

                } catch (error) {
                    console.error("Error sending verification email:", error);
                    throw error; // Rethrow the error to propagate it further
                }
            },
        })
    ],
    callbacks: {
        async signIn(data: any) {
            const { user, account, profile, email, credentials } = data;
            console.log("Sign in ", data);
            return true
        },
        async session(data: any) {
            const { session, user, token } = data;
            console.log("Session", data)
            return session
        },
        async jwt(data: any) {
            const { token, user, account, profile, isNewUser } = data
            console.log("JWT", data)
            return token
        }
    }
}
export default NextAuth(authOptions)

export async function isEmailVerified(email: any, token: string) {
    try {
        return true;
    } catch (error) {
        console.error('Error checking email verification:', error);
        return false;
    }
}