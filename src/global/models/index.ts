import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String }
});

const boardSchema = new mongoose.Schema({
    boardName: { type: String, required: true },
    workspace: { type: String, required: true },
    members: [{ type: String }],
    cards: [{
        cardName: { type: String, required: true },
        items: [{ title: { type: String } }]
    }],
    logs: [{ type: String }]
});

const cardInfoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    CardInfoN: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' }
});

const boardLogSchema = new mongoose.Schema({
    history: [{
        logs: [{
            cardName: { type: String, },
            items: [{ title: { type: String } }]
        }],
        time: { type: String },
        changedData: { type: String }
    }],
    BoardLogsN: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' }
});


export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Board = mongoose.models.Board || mongoose.model('Board', boardSchema);
export const CardInfo = mongoose.models.CardInfo || mongoose.model('CardInfo', cardInfoSchema);
export const BoardLog = mongoose.models.BoardLog || mongoose.model('BoardLog', boardLogSchema);

// Export the models
// module.exports = {
//   User,
//   Board,
//   Card,
//   CardInfo,
//   BoardLog
// };
