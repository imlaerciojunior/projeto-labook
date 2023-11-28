import express from "express"
import { PostController } from "../controller/PostController"
import { PostBusiness } from "../business/PostBusiness"
import { PostDatabase } from "../database/PostDatabase"

export const postRouter = express.Router()

const postsController = new PostController(
    new PostBusiness(new PostDatabase()
));

postRouter.get("/",postsController.getPosts)
postRouter.post("/",postsController.createPosts)
postRouter.put("/:id",postsController.updatePosts)
postRouter.delete("/:id",postsController.deletePosts)