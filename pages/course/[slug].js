import styles from '@styles/Admin.module.css';
import AuthCheck from '@components/AuthCheck';
import { firestore, auth, serverTimestamp, getFirestore, query,
  collection,
  where } from '@lib/firebase';

import ImageUploader from '@components/ImageUploader';

import { useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce, useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { UilEye } from '@iconscout/react-unicons'
import { UilTrashAlt } from '@iconscout/react-unicons'
import { UilDesktop } from '@iconscout/react-unicons'
import kebabCase from 'lodash.kebabcase';

const collection2 = 'courses';

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore.collection(collection2).doc(slug);
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <p style={{color: '#436543',margin: 0}}>Course Name:</p>
              <div style={{display: 'flex', maxWidth: '120px', justifyContent: 'space-evenly'}}>
                <div onClick={() => setPreview(!preview)}><UilEye size="20" color="#61DAFB"/></div>
                <Link href={`/${post.username}/${post.slug}`}>
                  <div  style={{width: 30, height: 30}}><UilDesktop size="20" color="#61DAFB"/></div>
                </Link>
                <DeletePostButton postRef={postRef} />
              </div>
            </div>
            {/* <h1 style={{margin: 0}}>{post.title}</h1>
            <p style={{margin: 0, color: '#ccc', marginBottom: '20px'}}>ID: {post.slug}</p> */}

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Lessons</h3>
            <AddLesson postRef={postRef} defaultValues={post} preview={preview} />
          </aside>
        </>
      )}
    </main>
  );
}


function AddLesson({ defaultValues, postRef, preview }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });
  const [title, setTitle] = useState('');
  

const [data] = useCollectionData(postRef.collection('lessons'))
console.log('data', data)

   // Ensure slug is URL safe
   const slug = encodeURI(kebabCase(title));

   // Validate length
   const isValid = title.length > 3 && title.length < 100;
 
   // Create a new post in firestore
   const createPost = async (e) => {
     e.preventDefault();
     const uid = auth.currentUser.uid;
     const ref = postRef.collection('lessons').doc(slug);
 
     // Tip: give all fields a default value here
     const data = {
       title,
       slug,
       content: '# hello world lesson content',
       createdAt: serverTimestamp(),
       updatedAt: serverTimestamp()
     };
 
     await ref.set(data);
 
     toast.success('Lesson created!');
     setTitle('')
 
     // Imperative navigation after doc is set
     // router.push(`/course/${slug}`);
   };

  return (
    <form onSubmit={createPost}>

      <div className={preview ? styles.hidden : styles.controls}>
        <input
          value={title || ""}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={"Write lesson name"}
          className={styles.input}
        />

        <button type="submit" className="btn-green" disabled={!isValid}>
          Add Lesson
        </button>
        {data && data.length ? data.map((item, i) =>(
          <div key={i}>
          <p>{item.title}</p>
          </div>
        )): null}
      </div>
    </form>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <input
          value={defaultValues.title || ""}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={"Write your " + collection2 +" name"}
          className={styles.input}
        />
        <p style={{margin: 0, color: '#ccc', marginBottom: '20px'}}>ID: {defaultValues.slug}</p>

        <ImageUploader />

        <textarea
          name="content"
          ref={register({
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && <p className="text-danger">{errors.content.message}</p>}

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" ref={register} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="btn-green" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await postRef.delete();
      router.push('/courses');
      toast('post removed ', { icon: '🗑️' });
    }
  };

  return (
    <div className="btn-red" onClick={deletePost}>
      <UilTrashAlt/>
    </div>
  );
}
