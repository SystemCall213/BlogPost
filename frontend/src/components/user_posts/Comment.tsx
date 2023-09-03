import './Comment.css'

interface CommentProps {
    comment: string,
    postedBy: string,
    time: string
}

export default function Comment({ comment, postedBy, time } : CommentProps) {
    return (
        <div className="comm-main">
            <div className='posted-by-comm'>
                Posted by {postedBy} {time}
            </div>
            <div>
                {comment}
            </div>
        </div>
    )
}