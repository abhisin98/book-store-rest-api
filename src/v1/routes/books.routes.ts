import { Router } from "express";

import { GET, POST, PUT, DELETE } from "../controllers/books";

const router = Router();

// --------------------------------------------------------------------
// TODO: move all controllers in the controllers folder
router.get("/", GET);
router.post("/", POST);
router.put("/:id", PUT);
router.delete("/:id", DELETE);

// --------------------------------------------------------------------
export { router as booksRouter };
