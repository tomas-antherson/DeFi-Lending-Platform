import { model, Schema } from 'mongoose';

const ContractSchema: Schema = new Schema({
    name: {
        type: String, require: true
    },
    bookname: {
        type: String, default: ""
    },
    symbol: {
        type: String, default: ""
    },
    owner: {
        type: String, default: ""
    },
    icon: {
        type: String, default: ""
    },
    contract: {
        type: String, default: "", unique: true
    },
    description: {
        type: String, default: ""
    },
    aboutus: {
        type: String, default: ""
    },
    royalties: {
        type: String, default: ""
    },
    uri: {
        type: String, default: ""
    },
    tokenIdIndex: {
        type: String, default: ""
    },
    isDeleted: {
        type: Boolean, default: false
    }
},
    { timestamps: true }
);


const Contract = model('contract', ContractSchema);

export default Contract;