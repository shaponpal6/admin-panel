import styles from '@styles/Admin.module.css';
import AuthCheck from '@components/AuthCheck';
import PostFeed from '@components/PostFeed';
import { UserContext } from '@lib/context';
import { firestore, auth, serverTimestamp } from '@lib/firebase';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { useContext, useState } from 'react';
import { useRouter } from 'next/router';

import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const collection = 'vocabulary';

export default function AdminPostsPage(props) {
  return (
    <main className={styles.center}>
      <Box style={{marginTop: '20px', width: '90%'}}>
      <AuthCheck>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
      </Box>
    </main>
  );
}

function PostList() {
  const ref = firestore.collection(collection);
  const query = ref.orderBy('createdAt', 'desc');
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
      {collection}
          </Typography>
      <PostFeed type={collection} posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore.collection(collection).doc(slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!' + collection,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success(collection + ' created!');
    setTitle('')

    // Imperative navigation after doc is set
    // router.push(`/course/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <TextField id="outlined-basic" label="Write vocabulary type" variant="outlined" onChange={(e) => setTitle(e.target.value)} className={styles.input}/>
      
      <Stack direction="row" className={styles.center2}>
      <Button type="submit" disabled={!isValid} variant="contained" endIcon={<SendIcon />}>
        Create & add Vocabulary
      </Button>
    </Stack>
    </form>
  );
}
