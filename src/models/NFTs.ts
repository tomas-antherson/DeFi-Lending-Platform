import { model, Schema } from 'mongoose';

const MetadataSchema: Schema = new Schema({
    title: {
        type: String, required: true,
    },
    description: {
        type: String, default: ''
    },
    media: {
        type: String, required: true,
    },
    reference: {
        type: String, required: true,
    },
    reference_hash: {
        type: String, default: null,
    },
    price: {
        type: String, default: "0",
    },
});

const NFTsSchema: Schema = new Schema({
    accountId: {
        type: String, required: true,
    },
    contract: {
        type: String, required: true,
    },
    token_id: {
        type: String, required: true,
    },
    metadata: {
        type: MetadataSchema, required: true,
    },
    isActive: {
        type: Boolean, default: false,
    }
},
    { timestamps: true }
);

const NFTs = model('NFTs', NFTsSchema);

export default NFTs;
