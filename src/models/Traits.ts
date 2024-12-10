import { model, Schema } from 'mongoose';

const TraitsSchema: Schema = new Schema({
    contract: {
        type: String, default: "", unique: true
    },
    traits: {
        type: String, default: ""
    },
},
    { timestamps: true }
);


const Traits = model('traits', TraitsSchema);

export default Traits;