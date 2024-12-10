import { Response } from 'express';
import { Request } from '../types';
import Contract from '../models/Contract';
import multer from 'multer';
import axios from 'axios';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({
    storage: storage
}).single('file');

export const createNew = async (req: Request, res: Response) => {
    try {
        const { name, symbol, owner, contract, uri } = req.body;
        if (!name || !symbol || !owner || !contract || !uri)
            res.json({ result: "ERROR", error: "Missing required arguments" });
        const query = { name, symbol, owner, contract, uri, tokenIdIndex: "0" }
        const newDoc = new Contract(query)
        const newData = await newDoc.save();
        res.json({ success: true, newData });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { contract } = req.query;
        if (!contract)
            res.json({ result: "ERROR", error: "Missing required arguments" });
        await Contract.findOneAndUpdate({ contract }, { isDeleted: true })
        getNFTContracts(req, res)
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};

export const uploadFile = async (req: Request, res: Response) => {
    const { contract } = req.query;
    if (!contract)
        res.json({ result: "ERROR", error: "Missing required arguments" });
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).json({ message: err.message });
        } else {
            const filePath = req.file.path;
            console.log('filePath', filePath)
            const updateData = await Contract.findOneAndUpdate({ contract }, { icon: filePath })
            res.status(200).json({ data: updateData, message: 'File uploaded successfully' });
        }
    });

};

export const updateTokenIndex = async (index: string, contract: string) => {
    try {
        await Contract.findOneAndUpdate({ contract }, { tokenIdIndex: index });
        return true
    } catch (error: any) {
        console.error(`error`, error);
    }
};

export const updateBasicInfo = async (req: Request, res: Response) => {
    try {
        const { name, contract, description, aboutus, bookname } = req.body;
        if (!name || !contract)
            res.json({ result: "ERROR", error: "Missing required arguments" });
        const updatedData = await Contract.findOneAndUpdate({ contract }, { name, description, aboutus, bookname });
        res.json({ success: true, data: updatedData });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};

export const updateRoyaltyInfo = async (req: Request, res: Response) => {
    try {
        const { royalties, contract } = req.body;
        if (!royalties || !contract)
            res.json({ result: "ERROR", error: "Missing required arguments" });

        const updatedData = await Contract.findOneAndUpdate({ contract }, { royalties: JSON.stringify(royalties) });
        res.json({ success: true, data: updatedData });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};

export const getNFTContracts = async (req: Request, res: Response) => {
    try {
        const { accountId } = req.query;
        if (!accountId)
            res.json({ result: "ERROR", error: "Missing required arguments" });

        const tokens = await Contract.find({ owner: accountId, isDeleted: false });
        res.json({ tokens, success: true });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
}

export const getNFTbyContractname = async (req: Request, res: Response) => {
    try {
        const { contract } = req.query;
        if (!contract)
            res.json({ result: "ERROR", error: "Missing required arguments" });
        const token = await Contract.find({ contract });
        res.json({ token: token[0], success: true });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
}

export const getActivities = async (req: Request, res: Response) => {
    const { contract } = req.query
    const url = 'https://graph.mintbase.xyz/testnet';
    const query = `
        query v2_omnisite_GetActivityByContract($contract: String!, $limit: Int!, $offset: Int!) {
            activities: mb_views_nft_activities(
            limit: $limit
            offset: $offset
            order_by: {timestamp: desc}
            where: {nft_contract_id: {_eq: $contract}}
            ) {
            kind
            description
            media
            title
            timestamp
            nft_contract_id
            action_sender
            receipt_id
            action_receiver
            token_id
            price
            currency
            nft_contract {
                name
                id
                base_uri
            }
            metadata_id
            }
            totalItems: mb_views_nft_activities_aggregate(where: {nft_contract_id: {_eq: $contract}}) {
            aggregate {
                count
            }
            }
        }
        `;

    const variables = {
        contract,
        limit: 100,
        offset: 0
    };

    axios.post(url, {
        query,
        variables
    }, {
        headers: {
            'mb-api-key': "anon"
        }
    }).then(response => {
        res.json({ activities: response.data.data.activities, success: true });
    }).catch(error => {
        return res.status(400).json({ error });
    });
}