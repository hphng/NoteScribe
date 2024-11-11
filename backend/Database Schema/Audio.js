import mongoose from "mongoose";

const audioSchema = new mongoose.Schema({
    documentName: {
        type: String,
        default: "Untitled Document",
    },
    transcription: {
        type: String,
    },
    translation: {
        type: String,
    },
    language: {
        type: String,
    },
    s3AudioUrl: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Audio = mongoose.model('Audio', audioSchema);
export default Audio;