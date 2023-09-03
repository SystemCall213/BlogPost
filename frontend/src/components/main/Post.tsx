import './Post.css'

interface PostProps {
    userName: string,
    created_at: string,
    title: string,
    text: string
}

export default function Post({userName, created_at, title, text} : PostProps) {
    return (
        <div className=''>
            <div className='post-header'>
                <div className='post-title'>
                    {title}
                </div>
                <div className='post-posted-by'>
                    Posted by {userName} {created_at}
                </div>
            </div>
            <div className='post-footer'>
                {text}
            </div>
        </div>
    )
}