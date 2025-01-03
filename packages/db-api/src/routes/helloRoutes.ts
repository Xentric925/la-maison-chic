import express from 'express';
import { hello } from '../controllers/helloController';

const router = express.Router();

router.get('/hello', (req, res) => hello(req, res));

export default router;
