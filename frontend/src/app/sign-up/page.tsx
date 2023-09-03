'use client'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { supabase } from '../../supabase/supabase'
import { useState } from 'react'
import { redirect } from 'next/navigation';
import './page.css'

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
            blog-post-bay-chi.vercel.app
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
        </Typography>
    );
}

export default function SignUp() {
    const [author, setAuthor] = useState(false)
    const [commentator, setCommentator] = useState(false)
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (email === null || password === null) {
            return;
        }
        try {
            
            let { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: 'https://blog-post-bay-chi.vercel.app/'
                }
            })

            if (data) {
                try {
                    const { data: insertedData, error: insertError } = await supabase
                        .from('blog_user')
                        .insert(
                        {
                            email: email,
                            name: firstName,
                            surname: lastName,
                            password: password,
                            is_author: author,
                            user_id: data!.user!.id
                        }
                    );
                } catch (error) {
                    console.log(error)
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
        window.location.href = 'https://blog-post-bay-chi.vercel.app/'
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            autoFocus
                            onChange={handleFirstNameChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="family-name"
                            onChange={handleLastNameChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={handleEmailChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            onChange={handlePasswordChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div className='check-status'>
                            <button 
                            type="button"
                            onClick={
                                () => {if (author) {setCommentator(true); setAuthor(false)} else setCommentator(true)}
                            }
                            style={{ borderColor: `${commentator ? "#1976d2" : "gray"}`}}
                            >
                                I am a commentator
                            </button>
                            <button 
                            type="button"
                            onClick={
                                () => {if (commentator) {setAuthor(true); setCommentator(false)} else setAuthor(true)}
                            }
                            style={{ borderColor: `${author ? "#1976d2" : "gray"}`}}
                            >
                                I am an author
                            </button>
                        </div>
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={(!author && !commentator) || !firstName || !lastName || !email || !password}
                >
                    Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/sign-in">
                            Already have an account? Sign in
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
    );
}