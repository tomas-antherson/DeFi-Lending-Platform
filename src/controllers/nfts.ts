import fs from 'fs';
import { Response } from 'express';
import { Request } from '../types';
import NFTs from '../models/NFTs';
import multer from 'multer';
import path from 'path';
import Contract from '../models/Contract';
// import { updateTokenIndex } from './contract';


const createCustomDir = (path: string) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
    }
};

const assetesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const customPath = `./NFTAssets/${req.query.uri}/`;
        createCustomDir(customPath);
        cb(null, customPath);
    },
    filename: (req, file, cb) => {
        cb(null, req.query.index + path.extname(file.originalname));
    },
});

const assetsUpload = multer({
    storage: assetesStorage
}).single('file');

export const get = async (req: Request, res: Response) => {
    try {
        const { accountId, contract } = req.query;
        if (!accountId || !contract)
            res.json({ result: "ERROR", error: "Missing required arguments" });

        const nfts = await NFTs.find({ accountId, contract })
        res.json({ nfts });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};

export const getOne = async (req: Request, res: Response) => {
    try {
        const { _id } = req.query;
        if (!_id)
            res.json({ result: "ERROR", error: "Missing required arguments" });

        const nft = await NFTs.findOne({ _id })
        res.json({ nft });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};
export const getActiveNFT = async (req: Request, res: Response) => {
    try {
        const nft = await NFTs.findOne({ isActive: true });
        if (nft) {
            const contract = await Contract.findOne({ contract: nft.contract })
            res.json({ nft, contract });
        } else res.status(200).json('No Actived NFT Type');
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(200).json('Interanal server error');
    }
};

export const setActiveNFT = async (req: Request, res: Response) => {
    try {
        const { token_id, contract } = req.body;
        if (!token_id || !contract)
            res.json({ result: "ERROR", error: "Missing required arguments" });

        await NFTs.findOneAndUpdate({ isActive: true }, { isActive: false })
        const newData = await NFTs.findOneAndUpdate({ token_id, contract }, { isActive: true })
        if (newData)
            res.json({ success: true, newData });
        else res.json({ success: false, error: 'Internal error' });
    } catch (error: any) {
        console.error(`error`, error);
        return res.json({ success: false, error });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { accountId, contract, nftData } = req.body;
        if (!accountId || !contract || !nftData)
            res.json({ result: "ERROR", error: "Missing required arguments" });

        const data = {
            accountId,
            contract,
            token_id: nftData.token_id,
            metadata: {
                title: nftData.title,
                description: nftData.description,
                media: nftData.media,
                reference: nftData.reference,
                reference_hash: nftData.reference_hash,
                price: nftData.price
            }
        }
        const newDoc = new NFTs(data)
        const newData = await newDoc.save()
        // await updateTokenIndex(String(index), contract);
        res.json({ success: true, data: newData });

    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};

export const uploadNFTassets = async (req: Request, res: Response) => {
    const { isFile, uri, index } = req.query;
    if (!isFile || !uri || !index)
        res.json({ result: "ERROR", error: "Missing required arguments" });
    if (isFile === "true") {
        assetsUpload(req, res, async (err) => {
            if (err) {
                res.status(400).json({ message: err.message });
            } else {
                const filePath = req.file.path;
                // const updateData = await Contract.findOneAndUpdate({ contract }, { icon: filePath })
                res.status(200).json({ filePath, message: 'File uploaded successfully' });

            }
        });
    }
    else {
        const jsonData = req.body.jsonData; // Assuming JSON data is sent in the request body
        // Write JSON data to a JSON file in the custom path
        const customPath = `./NFTAssets/${uri}`;
        const jsonFilePath = `${customPath}/${index}.json`;
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

        res.status(200).json({ filePath: jsonFilePath, message: 'File uploaded and JSON data saved successfully!' });
    }

};
