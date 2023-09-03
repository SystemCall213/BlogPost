import './PostButton.css'

interface PostButtonProps {
    updateCreatePost: (value: boolean) => void;
}

export default function PostButton({ updateCreatePost }: PostButtonProps) {
    return (
        <div className="post-button">
            <div></div>
            <button type="button" className="make-post" onClick={() => updateCreatePost(true)}>
                Create Post
            </button>
        </div>
    )
}