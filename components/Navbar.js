import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '@lib/context';
import { auth } from '@lib/firebase';

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);

  const router = useRouter();

  const signOut =  () => {
    auth.signOut();
    router.reload();
  }

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">App</Link>
        </li>

        {/* user is signed-in and has username */}
        {username && (
          <>
            {/* <li className="push-left">
              <button onClick={signOut}>Sign Out</button>
            </li> */}
            {/* <li>
              <Link href="/admin">Posts</Link>
            </li>
            <li>
              <Link href="/quiz">QUIZ</Link>
            </li> */}
            <li>
              <Link href="/vocabulary">Vocabulary</Link>
            </li>
            <li>
              <Link href="/course">Course</Link>
            </li>
            {/* <li>
              <Link href="/competition">Competition</Link>
            </li> */}
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL || '/hacker.png'} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
