import axios from 'axios';
import { Response } from 'express';
import { Request } from '../types';
import Traits from '../models/Traits';

export const get = async (req: Request, res: Response) => {
    try {
        const { contract } = req.query;
        if (!contract)
            res.json({ result: "ERROR", error: "Missing required arguments" });

        const trait = await Traits.findOne({ contract })
        res.json({ data: trait });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const { contract, traits } = req.body;
        if (!contract || !traits)
            res.json({ result: "ERROR", error: "Missing required arguments" });

        const isExist = await Traits.find({ contract });
        if (isExist.length !== 0) {
            update(req, res);
        } else {
            const newDoc = new Traits({ contract, traits: JSON.stringify(traits) })
            const newData = await newDoc.save()
            res.json({ success: true, data: newData });
        }
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
};

const update = async (req: Request, res: Response) => {
    try {
        const { contract, traits } = req.body;
        
        const updateData = await Traits.findOneAndUpdate({ contract }, { traits: JSON.stringify(traits) })
        res.json({ success: true, data: updateData });
    } catch (error: any) {
        console.error(`error`, error);
        return res.status(400).json('Interanal server error');
    }
}