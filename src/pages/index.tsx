import { useSession, signIn, signOut } from "next-auth/react"
import React, { useEffect } from "react"
import { Icons } from "@/components/icons";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';


export default function Home() {
  //AUthOpen
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  //Local-States:
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { data: session }: any = useSession();
  //React-Query:
  const dataSaved = async (emailObject: String) => {
    const addEmail = {
      email: emailObject,
      OAuth  : true
    }
    console.log("Sending request : ", addEmail)
    const response = await fetch('http://localhost:3000/api/routes/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addEmail),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }

    return response.json();
  }
  const mutation = useMutation({ mutationFn: dataSaved });
  const router = useRouter()
  const handleSignIn = async () => {
    try {
      const result: any = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      if (result.error) {
        console.error('Sign-in failed:', result.error);
      } else {
        //Query to save
        router.push('/dashboard')
      }
    } catch (error: any) {
      console.error('Error:', error.message);
    }
  };
  useEffect(() => {
    if (session?.user.email) {
      mutation.mutate(session?.user.email);
      router.push('/dashboard')
    }
  }, [session])
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-bl from-custom-gradient-start via-custom-gradient-middle to-custom-gradient-end">
      <div className="w-10/12 h-full sm:min-w-full md:min-w-80 md:h-4/6 lg:max-w-80 xl:max-w-80">
        <div className="font-sans font-semibold mt-20 text-4xl">Sign In</div>
        <div className="font-sans text-base py-3 font-medium">Welcome back {`you've`} been missed</div>
        <div className="pt-10">
          <div className="font-sans text-lg font-semibold mb-1.5 ">Email ID</div>
          <input onChange={(e) => setEmail(e.target.value)} type="text" className="block w-full rounded-lg border-0  py-4 pl-4 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Enter Email ID" />

          <div className="font-sans text-lg font-semibold mt-7 mb-1.5">Password</div>
          <input onChange={(e) => setPassword(e.target.value)} type="text" className="block w-full rounded-lg border-0 py-4 pl-4 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="Enter Password" />
          <div className="flex items-center mt-1">
            <input type="checkbox" id="checkbox" className="form-checkbox h-5 w-5 rounded-lg text-purple-700" />
            <div className="font-sans text-base font-medium py-4 ml-3">Remember Me</div>
            <div className="font-sans text-base font-medium ml-auto py-2">Forgot Password ?</div>
          </div>
          <button className="bg-slate-950 text-white font-semibold text-xl pt-3 pb-4 px-4 rounded-lg w-full mt-10" onClick={handleSignIn}>
            Sign In
          </button>
          <div className="flex items-center justify-center mt-10">
            <hr className="w-1/3 border-t border-gray-300 mr-3.5" />
            <span className="font-sans text-sm font-medium">Or With</span>
            <hr className="w-1/3 border-t border-gray-300 ml-3.5" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex justify-center py-4 px-4 border-2 rounded-lg text-center text-base font-medium bg-white">
              {isGitHubLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 mt-1 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4 mt-1 " />
              )}
              <button
                type="button"
                onClick={() => {
                  setIsGitHubLoading(true)
                  signIn("github")
                }}
                disabled={isGitHubLoading}
              >
                Github
              </button>
            </div>
            <div className="py-1 px-2 border-2 flex justify-center rounded-lg text-center text-sm font-medium bg-white">
              <button className="gsi-material-button" onClick={() => { signIn("google"); setGoogleLoading(true) }}>
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper flex justify-center">
                  {googleLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 mt-1 animate-spin" />
                  ) : <div className="gsi-material-button-icon mt-1" style={{ width: 16, height: 12 }}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>}
                  <span className="gsi-material-button-contents text-base ml-2">Google</span>
                  <span style={{ display: 'none' }}>Google</span>
                </div>
              </button>
            </div>
          </div>
          <div className="text-center font-sans text-base text-gray-500 mt-32 mb-7">{`Don't`} have an account ?
            <span className="font-sans font-bold text-base text-gray-700 underline underline-offset-2 ml-2">Sign Up</span>
          </div>
        </div>
      </div>
    </div>
  );
}
