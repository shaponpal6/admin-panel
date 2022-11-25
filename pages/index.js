import PostFeed from '@components/PostFeed';
import Metatags from '@components/Metatags';
import Loader from '@components/Loader';
import AuthCheck from '@components/AuthCheck';
import { firestore, fromMillis, postToJSON } from '@lib/firebase';

import { useState } from 'react';

// Max post to query per page
const LIMIT = 10;

// async function getServerSideProps() {
//   const postsQuery = firestore
//     .collectionGroup('posts')
//     .where('published', '==', true)
//     .orderBy('createdAt', 'desc')
//     .limit(LIMIT);

//   const posts = (await postsQuery.get()).docs.map(postToJSON);
//   console.log('posts', posts)

//   return {
//     props: { posts }, // will be passed to the page component as props
//   };
// }

export default function Home(props) {
  // const [posts, setPosts] = useState(props.posts);
  // const [loading, setLoading] = useState(false);

  // const [postsEnd, setPostsEnd] = useState(false);
  // console.log('props', props)

  // // Get next page in pagination query
  // const getMorePosts = async () => {
  //   setLoading(true);
  //   const last = posts[posts.length - 1];

  //   const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;

  //   const query = firestore
  //     .collectionGroup('posts')
  //     .where('published', '==', true)
  //     .orderBy('createdAt', 'desc')
  //     .startAfter(cursor)
  //     .limit(LIMIT);

  //   const newPosts = (await query.get()).docs.map((doc) => doc.data());

  //   setPosts(posts.concat(newPosts));
  //   setLoading(false);

  //   if (newPosts.length < LIMIT) {
  //     setPostsEnd(true);
  //   }
  // };

  return (
    <AuthCheck>
    <main>
      {/* <Metatags title="Home Page" description="Get the latest posts on our site" /> */}

      <div className="card card-info">
        Welcome to the Home Page
      </div>
     
      {/* <PostFeed posts={posts} />

      {!loading && !postsEnd && <button onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'} */}
    </main>
    </AuthCheck>
  );
}
