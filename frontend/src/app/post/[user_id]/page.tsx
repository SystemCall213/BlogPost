'use client'

import './page.css'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/supabase'
import Post from '../../../components/main/Post'
import { formatTime } from  '../../page'
import Comment from '../../../components/user_posts/Comment'
import Link from 'next/link'

export default function UserPosts() {
    const params = useParams()
    const [posts, setPosts] = useState<any | null>(null)
    const [user, setUser] = useState<any | null>(null)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState<any | null>(null)

    async function getPostsByUserId() {
        try {
            const { data, error } = await supabase
            .from('post')
            .select()
            .eq('author_id', params.user_id) 

            if (data) {
                setPosts(() => data);
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

    useEffect(() => {
        async function fetchUserData() {
            try {
                const { data: { user } }  = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('blog_user')
                        .select('name, is_author, user_id') 
                        .eq('email', user.email)

                    if (data) {
                        setUser(data[0]);
                    }
                    if (error) console.log(error)
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getPostsByUserId()
        fetchUserData()
    }, [params.user_id])

    useEffect(() => {
        console.log(posts)
        console.log(comments)
    }, [posts, comments])

    async function PostComment(post_id: string, i: number) {
        try {
            const { data, error } = await supabase
                .from('comment')
                .insert({
                    comment: comment,
                    postedBy_name: user.name,
                    post_id: post_id,
                })
                .select()

            if (data) {
                console.log(data)
                const newCommentId = data[0].id;
                const existingComments = posts[i].comments || [];
                const updatedComments = [...existingComments, newCommentId];
                const { error } = await supabase
                    .from("post")
                    .update({ comments: updatedComments })
                    .eq("id", post_id);
            }
            getPostsByUserId()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {posts && (
                <div className='full'>
                    {posts.map((post: any, i: number) => (
                        <div key={post?.id} className='post-main'>
                            <Post userName={post.author_username} created_at={formatTime(post?.created_at)} title={post?.title} text={post?.text} />
                            {user && !user?.is_author && (
                                <div className='comment'>
                                    <input type="text" onChange={(e) => setComment(e.target.value)} className='comment-input' />
                                    <button type='button' onClick={() => PostComment(post?.id, i)} className='comment-button' >Comment</button>
                                </div>
                            )}
                            {comments && comments.map((comment: any) => {
                                if (comment.post_id === post.id) {
                                    return <Comment key={comment.id} comment={comment.comment} postedBy={comment.postedBy_name} time={formatTime(comment.created_at)} />;
                                }
                                return null; 
                            })}
                        </div>
                    ))}
                    <Link href='/'>Go to feed</Link>
                </div>
            )}
        </>
    )
}