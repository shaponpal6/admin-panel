import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@lib/context';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Fingerprint from '@mui/icons-material/Fingerprint';
import Button from '@mui/material/Button';

import styles from '@styles/Admin.module.css';

// Component's children only shown to logged-in users
export default function AuthCheck(props) {
  const { username } = useContext(UserContext);
  console.log('username', username)

  return username ? props.children : (<div className={styles.center + " "+ styles.full} >
      <Button variant="outlined" size="medium">
      You must be signed in
        </Button>
      <Link href="/enter">
        <IconButton aria-label="fingerprint" color="success">
        <Fingerprint />
      </IconButton>
    </Link>
    </div>);
}
