import { getAllMovies, getMovieById } from "../controllers/movie.controller";
import { Router } from "express";

const router = Router();

router.get('/get/:movieId', getMovieById);
router.get('/get-all-movies', getAllMovies);


export default router;