'use client'

import './page.css'
import Link from 'next/link'
import PostButton from '../components/feed/PostButton'
import { supabase } from '../supabase/supabase'
import { useEffect, useState } from 'react'
import CreatePost from '../components/main/CreatePost'
import Post from '../components/main/Post'
import Comment from '../components/user_posts/Comment'
import logo from '../assets/logo.png'
import Image from 'next/image'

function formatTime(time: string) {
  const inputDate = new Date(time);
  const formattedDate = `${inputDate.getDate()}/${inputDate.getMonth() + 1}/${inputDate.getFullYear()}`;
  const formattedTime = `${inputDate.getHours()}:${String(inputDate.getMinutes()).padStart(2, '0')}`;
  return `${formattedDate} at ${formattedTime}`
}

export default function Home() {
  const [createPost, setCreatePost] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [posts, setPosts] = useState<any | null>(null)
  const [comments, setComments] = useState<any | null>(null)

  const updateCreatePost = (value: boolean) => {
    setCreatePost(value);
    const mainDiv = document.querySelector('.main')
    if (createPost) {
        mainDiv?.classList.remove('main-blurred')
    } else {
        mainDiv?.classList.add('main-blurred')
    }
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const { data: { user } }  = await supabase.auth.getUser();
        console.log(user)
        
        if (user) {
          const { data, error } = await supabase
            .from('blog_user')
            .select('name, is_author, user_id') 
            .eq('email', user.email)

          if (data) {
            setUser(data[0]);
          } else {
            setUser(null)
          }
          if (error) console.log(error)
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null)
      }
    }
    async function getPosts() {
      try {
        const { data, error } = await supabase
            .from('post')
            .select() 

          if (data) {
            setPosts(data);
            const commentIds = data.reduce((accumulator: any, post: any) => {
              if (post.comments && Array.isArray(post.comments)) {
                  accumulator.push(...post.comments);
              }
                return accumulator;
              }, []);
              console.log(commentIds)
              try {
                  const { data, error } = await supabase
                      .from('comment')
                      .select()
                      .in('id', commentIds)
      
                  if (data) {
                      setComments(data)
                      console.log(data)
                  }
              } catch (error) {
                  console.log(error)
              }
          }
      } catch (error) {
        console.log(error)
      }
    }
    
    fetchUserData();
    getPosts()
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <div className='main'>
        <div className='content'>
          <header className='header'>
            <Image src={logo} alt='logo' className='logo' />
            {user ? (
              <div className='user-feed'>
                <div>{user.name}</div>
                <button onClick={handleLogout} className='make-post'>Log Out</button>
              </div>
            ) : (
              <Link href="/sign-in">Sign in</Link>
            )}
          </header>
          {user && (
            user.is_author && (
              <PostButton updateCreatePost={updateCreatePost} />
            )
          )}
          {posts && (
            posts.map((post: any) => (
              <div key={post?.id} className='post'>
                <Link href={`/post/${post.author_id}`} className='post-link'>
                  <Post userName={post.author_username} created_at={formatTime(post?.created_at)} title={post?.title} text={post?.text} />
                </Link>
                {comments && comments.map((comment: any) => {
                    if (comment.post_id === post.id) {
                        return <Comment key={comment.id} comment={comment.comment} postedBy={comment.postedBy_name} time={formatTime(comment.created_at)} />;
                    }
                    return null; 
                })}
              </div>
            ))
          )}
        </div>
      </div>
      {createPost && (
        <CreatePost updateCreatePost={updateCreatePost} user={user} />
      )}
    </>
  )
}
