import { Router } from 'express';

import contract from './contract';
import traits from './traits';
import nfts from './nfts';

const router: Router = Router();
router.use('/contract', contract);
router.use('/traits', traits);
router.use('/nfts', nfts);

export default router;
