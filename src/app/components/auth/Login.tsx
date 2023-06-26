import Modal from 'react-modal';
import cookieCutter from 'cookie-cutter';
import { useRef, useState } from 'react';

export default function Login() {
  const [isOpen, setIsOpen] = useState(false);
  const userName = useRef('');
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }
  return (
    <>
      <a
        href="/api/auth/signin"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(true);
        }}
      >
        Join
      </a>
      <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
        <h1>Please enter a username</h1>
        <input type="text" className="mt-4 border" ref={userName} />
        <br />
        <div className="ml-12 mt-6">
          <button onClick={() => {
            cookieCutter.set('playerName', userName.current.value);
            window.location.reload(true);
            setIsOpen(false);
          }}>Enter</button>
          <button className="ml-2" onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </Modal>
    </>
  );
}
