import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <a
      href="/api/auth/signin"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={(e) => {
        e.preventDefault();
        signIn();
      }}
    >
      Sign in
    </a>
  );
}
