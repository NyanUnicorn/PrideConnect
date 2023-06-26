"use client";

import cookieCutter from 'cookie-cutter';

export default function NavItemContainer() {
  const playerName = cookieCutter.get('playerName');

  return (
    <div>
      {!playerName ? (
        <span className='ml-2 items-end mr-40 mt-4'>Hello welcome to this page</span>
      ) : (
        <a
          // eslint-disable-next-line react/jsx-curly-brace-presence
          href={`/api/auth/signout`}
          className='mr-40 mt-4 mb-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
          onClick={(e) => {
            e.preventDefault();
            cookieCutter.set('playerName', '', { expires: new Date(0) });
            window.location.reload(true);
          }}
        >
          Leave
        </a>
      )}
    </div>
  );
}
