import PostScheme from "../shemas/Post.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostScheme.find().limit(5).exec();

        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5);

        res.json(tags);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to get tags",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostScheme.find().populate("user").exec();
        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to get articles",
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostScheme.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: "after",
            }
        ).populate("user");

        if (!doc) {
            return res.status(404).json({
                message: "Article not found",
            });
        }

        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to get articles",
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostScheme.findOneAndDelete({
            _id: postId,
        });

        if (!doc) {
            return res.status(404).json({
                message: "Article not found",
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to delete article",
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostScheme({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(","),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to create article",
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostScheme.updateOne(
            {
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags.split(","),
            }
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to update article",
        });
    }
};
