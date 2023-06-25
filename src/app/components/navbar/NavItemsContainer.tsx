'use client';

import { signOut, useSession } from 'next-auth/react';

export default function NavItemContainer() {
  const { data: session } = useSession();
  return (
    <>
      { !session ?
      <span className="ml-2 items-end mr-40 mt-4">
        Hello welcome to this page
      </span> :
      (
        <a
          href={`/api/auth/signout`}
          className="mr-40 mt-4 mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => {
            signOut()
          }}
        >
          Sign out
        </a>
      )}
    </>
  );
}
