import { Router } from 'express';
import { get, create, uploadNFTassets, getOne, setActiveNFT, getActiveNFT } from '../controllers/nfts';

const router: Router = Router();

router.get('/', get);
router.post("/get_one", getOne);
router.get("/get_active", getActiveNFT);
router.post('/', create);
router.post('/set_active', setActiveNFT);
router.post("/asset_upload", uploadNFTassets);

export default router;
