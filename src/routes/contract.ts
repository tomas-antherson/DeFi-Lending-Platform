import { Router } from 'express';
import { createNew, deleteProject, getNFTbyContractname, getNFTContracts, uploadFile, updateBasicInfo, updateRoyaltyInfo, getActivities } from '../controllers/contract';

const router: Router = Router();

router.post("/", createNew);
router.post("/delete", deleteProject);
router.post("/upload", uploadFile);
router.post("/update_basic", updateBasicInfo);
router.post("/update_royalty", updateRoyaltyInfo);
router.get("/", getNFTContracts);
router.get("/get_token_by_contract", getNFTbyContractname);
router.get("/get_activities", getActivities);

export default router;
