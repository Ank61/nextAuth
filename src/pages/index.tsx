import { useSession, signIn, signOut } from "next-auth/react"
import React from "react"
import { Icons } from "@/components/icons"

export default function Home() {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const { data: session }: any = useSession();

  const handleSignIn = async () => {
    try {
      const result :any= await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
  
      if (result.error) {
        console.error('Sign-in failed:', result.error);
      } else {
        const jwtToken = result.jwt;
        console.log('JWT token:', jwtToken);
      }
    } catch (error:any) {
      console.error('Error:', error.message);
    }
  };

  if (session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="card">
          <button className="cssbuttons-io" onClick={() => signOut()}>
            <span
            ><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M24 12l-5.657 5.657-1.414-1.414L21.172 12l-4.243-4.243 1.414-1.414L24 12zM2.828 12l4.243 4.243-1.414 1.414L0 12l5.657-5.657L7.07 7.757 2.828 12zm6.96 9H7.66l6.552-18h2.128L9.788 21z"
                  fill="currentColor"
                ></path>
              </svg>
              Sign out
            </span>
          </button>
          <div className="card-info">
            <div className="card-avatar"></div>
            <div className="card-title">Signed in as {session?.user.email}</div>
            <div className="card-subtitle">CEO &amp; Co-Founder</div>
          </div>
          <ul className="card-social">
            <li className="card-social__item">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 9h3l-.375 3H14v9h-3.89v-9H8V9h2.11V6.984c0-1.312.327-2.304.984-2.976C11.75 3.336 12.844 3 14.375 3H17v3h-1.594c-.594 0-.976.094-1.148.281-.172.188-.258.5-.258.938V9z"></path>
              </svg></li>
            <li className="card-social__item">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.875 7.5v.563c0 3.28-1.18 6.257-3.54 8.93C14.978 19.663 11.845 21 7.938 21c-2.5 0-4.812-.687-6.937-2.063.5.063.86.094 1.078.094 2.094 0 3.969-.656 5.625-1.968a4.563 4.563 0 0 1-2.625-.915 4.294 4.294 0 0 1-1.594-2.226c.375.062.657.094.844.094.313 0 .719-.063 1.219-.188-1.031-.219-1.899-.742-2.602-1.57a4.32 4.32 0 0 1-1.054-2.883c.687.328 1.375.516 2.062.516C2.61 9.016 1.938 7.75 1.938 6.094c0-.782.203-1.531.609-2.25 2.406 2.969 5.515 4.547 9.328 4.734-.063-.219-.094-.562-.094-1.031 0-1.281.438-2.36 1.313-3.234C13.969 3.437 15.047 3 16.328 3s2.375.484 3.281 1.453c.938-.156 1.907-.531 2.907-1.125-.313 1.094-.985 1.938-2.016 2.531.969-.093 1.844-.328 2.625-.703-.563.875-1.312 1.656-2.25 2.344z"></path>
              </svg></li>
            <li className="card-social__item">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.547 3c.406 0 .75.133 1.031.398.281.266.422.602.422 1.008v15.047c0 .406-.14.766-.422 1.078a1.335 1.335 0 0 1-1.031.469h-15c-.406 0-.766-.156-1.078-.469C3.156 20.22 3 19.86 3 19.453V4.406c0-.406.148-.742.445-1.008C3.742 3.133 4.11 3 4.547 3h15zM8.578 18V9.984H6V18h2.578zM7.36 8.766c.407 0 .743-.133 1.008-.399a1.31 1.31 0 0 0 .399-.96c0-.407-.125-.743-.375-1.009C8.14 6.133 7.813 6 7.406 6c-.406 0-.742.133-1.008.398C6.133 6.664 6 7 6 7.406c0 .375.125.696.375.961.25.266.578.399.984.399zM18 18v-4.688c0-1.156-.273-2.03-.82-2.624-.547-.594-1.258-.891-2.133-.891-.938 0-1.719.437-2.344 1.312V9.984h-2.578V18h2.578v-4.547c0-.312.031-.531.094-.656.25-.625.687-.938 1.312-.938.875 0 1.313.578 1.313 1.735V18H18z"></path>
              </svg>
            </li>
          </ul>
        </div>
      </div>
    )
  }
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
