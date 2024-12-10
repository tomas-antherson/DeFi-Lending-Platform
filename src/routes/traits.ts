import { Router } from 'express';
import { get, create } from '../controllers/traits';

const router: Router = Router();

router.get('/', get);
router.post('/', create);

export default router;
