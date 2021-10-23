const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const Response = require("../utils/response.utils");

module.exports = {
    editPostHandler: async (req, res) => {
        try {
            const editedPost = req.body.body;
            const post = await Post.findById(req.params.id);

            if (!post) {
                throw new Error();
            }
            // checks and allows only post authors to edit a post
            if (post.author != req.user._id) {
                return res.status(403).send(Response.forbidden("", {}));
            }

            post.body = editedPost;
            await post.save();
            res.send(Response.success("", { post: { postData: post, authorData: req.user } }));
        } catch (err) {
            res.status(500).send(Response.error("Some error occured", {}));
        }
    },

    deletePostHandler: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                throw new Error();
            }

            // delete post via its id
            const postDeleted = await Post.deleteOne({ _id: req.params.id });

            if (!postDeleted) {
                throw new Error();
            }
            const commentsDeleted = await Comment.deleteMany({ post_id: post._id });

            if (!commentsDeleted) {
                throw new Error();
            }

            res.send(Response.success("Post successfully deleted", { post: { _id: post._id } }));
        } catch (err) {
            res.status(500).send(Response.error("", {}));
        }
    },
    addCommentHandler: async (req, res) => {
        try {
            const comment = req.body.body;
            // generating a new comment
            const newComment = new Comment();
            newComment.body = comment;
            newComment.author = req.user._id;
            newComment.post_id = req.params.id;

            await newComment.save().then(async () => {
                // increments the comment count of the post
                await Post.findOneAndUpdate({ _id: req.params.id }, { $inc: { commentCount: 1 } });
            });

            const post = await Post.findById(req.params.id);

            let author = await Student.findById(post.author);

            if (!author) {
                author = await Mentor.findById(post.author);
            }

            if (!author) {
                throw new Error();
            }

            res.send(
                Response.success("Comment created", {
                    post: {
                        postData: post,
                        authorData: author,
                    },
                    comment: {
                        commentData: newComment,
                        authorData: req.user,
                    },
                })
            );
        } catch (err) {
            console.log(err);
            res.status(500).send(Response.error("", {}));
        }
    },

    fetchAllCommentsHandler: async (req, res) => {
        try {
            const allComments = [];
            const post = await Post.findById(req.params.id);

            if (!post) {
                throw new Error();
            }

            const comments = await Comment.find({ post_id: post._id }).sort({ createdAt: "asc" });

            for (let i = 0; i < comments.length; i++) {
                let user = await Mentor.findById(comments[i].author);

                if (!user) {
                    user = await Student.findById(comments[i].author);
                }

                let comment = {
                    commentData: comments[i],
                    authorData: user,
                };

                allComments.push(comment);
            }

            res.send(
                Response.success("", { commentsCount: allComments.length, comments: allComments })
            );
        } catch (err) {
            console.log(err);
            res.status(500).send(Response.error("", {}));
        }
    },

    deleteCommentHandler: async (req, res) => {
        try {
            const cid = req.params.id; // comment id

            const comment = await Comment.findOneAndDelete({ _id: cid }).then(async (data) => {
                //decrements the comment count of the post
                await Post.findOneAndUpdate({ _id: data.post_id }, { $inc: { commentCount: -1 } });
                return data;
            });

            if (!comment) {
                return res.status(404).send(Response.notfound("Comment Not found", {}));
            }

            let post = await Post.findById(comment.post_id);

            let author = await Student.findById(post.author);

            if (!author) {
                author = await Mentor.findById(post.author);
            }

            if (!author) {
                throw new Error();
            }

            res.send(
                Response.success("Comment deleted", {
                    post: {
                        postData: post,
                        authorData: author,
                    },
                    comment: {
                        commentData: comment,
                        authorData: req.user,
                    },
                })
            );
        } catch (err) {
            console.log(err);
            res.status(500).send(Response.error("", {}));
        }
    },
};
