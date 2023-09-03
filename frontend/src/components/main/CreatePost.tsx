import TextField from '@mui/material/TextField';
import { useState } from 'react'
import { supabase } from '../../supabase/supabase'
import './CreatePost.css'

interface CreatePostProps {
    updateCreatePost: (value: boolean) => void,
    user: any
}

export default function CreatePost({ updateCreatePost, user }: CreatePostProps) {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [titleBlurred, setTitleBlurred] = useState(false)
    const [textBlurred, setTextBlurred] = useState(false)

    const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    async function createPost() {
        if (title.length >= 4 && text.length >= 40) {
            try {
                const { data, error } = await supabase
                    .from('post')
                    .insert(
                    {
                        title: title,
                        text: text,
                        author_username: user.name,
                    }
                );
                updateCreatePost(false)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div className="create-post">
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label="Post title"
                name="title"
                variant="standard"
                onChange={handleTitle}
                onFocus={() => {setTitleBlurred(false)}}
                onBlur={() => {setTitleBlurred(true)}}
                error={title.length < 4 && titleBlurred}
                helperText={title.length < 4 && titleBlurred && "Must be at least 4 character long"}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="text"
                label="What do you want to tell the world about?"
                name="text"
                variant="outlined"
                multiline
                minRows={4}
                onFocus={() => {setTextBlurred(false)}}
                onBlur={() => {setTextBlurred(true)}}
                onChange={handleText}
                error={text.length < 40 && textBlurred}
                helperText={text.length < 40 && textBlurred && "Must be at least 40 character long"}
            />
            <div className='button-div'>
                <button type='button' onClick={() => updateCreatePost(false)} className='button'>Cancel</button>
                <button type='button' onClick={() => createPost()} className='button' disabled={!title || ! text} style={{borderColor: `${(!title || !text) ? 'grey' : '#1976d2'}`}}>Create Post</button>
            </div>
        </div>
    )
}