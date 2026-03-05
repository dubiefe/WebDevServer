import Comment from "../models/comment.model";

// POST /api/comment/
export const createComment = async (req, res) => {
    const { content, author, post, likes } = req.body;

    const newComment = await Movie.create({ content: content, author: author, post: post, likes: likes });
    
    res.status(201).json({message: "Comment posted", content: newComment});
}

// GET /api/post/:id/comments/
export const listComments = async (req, res) => {
    const post_id = parseInt(req.params.id);
    const role = res.headers.get('role');

    var comments = []
    if(role == 'admin') {
        comments = await Comment.findWithDeleted().filter({post: post_id})
    } else {
        comments = await Comment.excludeDeleted().filter({post: post_id})
    }
    
    res.status(201).json(comments);
}

// DELETE /api/comment/:id/
export const deleteComment = async (req, res) => {
    const id = parseInt(req.params.id);
    const user_name = res.headers.get('user_name');

    try {
        const comment = await Comment.findById(id); 
        if(comment.author.name == user_name) {
            const deletedComment = await Comment.softDeleteById(id);
            res.status(200).json({ message: 'Comment deleted', content: deletedComment });
        } else {
            res.status(401).json({ error: 'Delete not authorized' });
        }
    } catch {
        res.status(404).json({ error: 'Comment not found' });
    }
}

// PATCH api/comment/:id/restore/
export const restoreComment = async (req, res) => {
    const id = parseInt(req.params.id);
    const role = res.headers.get('role');

    try {
        const comment = await Comment.findById(id); 
        if(role == "admin") {
            const restoredComment = await Comment.restoreById(id);
            res.status(200).json({ message: 'Comment restored', content: restoredComment });
        } else {
            res.status(401).json({ error: 'Restore not authorized' });
        }
    } catch {
        res.status(404).json({ error: 'Comment not found' });
    }
}