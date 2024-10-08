import { pipeline, env } from '@xenova/transformers'
import { MessageTypes } from './data.js'
env.allowLocalModels = false;

class MyTranscriptionPipeline {
    static task = 'automatic-speech-recognition'
    static model = 'Xenova/whisper-tiny.en'
    static instance = null

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback })
        }

        return this.instance
    }
}

self.addEventListener('message', async (event) => {
    const { type, audio } = event.data
    if (type === MessageTypes.INFERENCE_REQUEST) {
        await transcribe(audio)
    }
})

async function transcribe(audio) {
    sendLoadingMessage('loading')

    let pipeline

    try {
        pipeline = await MyTranscriptionPipeline.getInstance(load_model_callback)
    } catch (err) {
        console.log(err.message)
    }

    sendLoadingMessage('success')

    const stride_length_s = 5

    const generationTracker = new GenerationTracker(pipeline, stride_length_s)
    await pipeline(audio, {
        model: MyTranscriptionPipeline.model,
        top_k: 0,
        do_sample: false,
        chunk_length_s: 30,
        stride_length_s: 1,
        return_timestamps: false,
        callback_function: generationTracker.callbackFunction.bind(generationTracker),
        chunk_callback: generationTracker.chunkCallback.bind(generationTracker)
    })
    generationTracker.sendFinalResult()
}

async function load_model_callback(data) {
    const { status } = data
    if (status === 'progress') {
        const { file, progress, loaded, total } = data
        sendDownloadingMessage(file, progress, loaded, total)
    }
}

function sendLoadingMessage(status) {
    self.postMessage({
        type: MessageTypes.LOADING,
        status
    })
}

async function sendDownloadingMessage(file, progress, loaded, total) {
    self.postMessage({
        type: MessageTypes.DOWNLOADING,
        file,
        progress,
        loaded,
        total
    })
}

class GenerationTracker {
    constructor(pipeline, stride_length_s) {
        this.pipeline = pipeline
        this.stride_length_s = stride_length_s
        this.chunks = []
        this.time_precision = pipeline?.processor.feature_extractor.config.chunk_length / pipeline.model.config.max_source_positions
        this.processed_chunks = []
        this.callbackFunctionCounter = 0
    }

    sendFinalResult() {
        self.postMessage({ type: MessageTypes.INFERENCE_DONE })
    }

    callbackFunction(beams) {
        this.callbackFunctionCounter += 1
        if (this.callbackFunctionCounter % 10 !== 0) {
            return
        }

        const bestBeam = beams[0]
        let text = this.pipeline.tokenizer.decode(bestBeam.output_token_ids, {
            skip_special_tokens: true
        })

        const result = {
            text,
            start: this.getLastChunkTimestamp(),
            end: undefined
        }

        createPartialResultMessage(result)
    }

    chunkCallback(data) {
        this.chunks.push(data)
        // const [text, { chunks }] = this.pipeline.tokenizer._decode_asr(
        //     this.chunks,
        //     {
        //         time_precision: this.time_precision,
        //         return_timestamps: true,
        //         force_full_sequence: false
        //     }
        // )
        const [text] = this.pipeline.tokenizer._decode_asr(
            this.chunks,
            {
                return_timestamps: false,  // Ensure timestamps are not being returned
                time_precision: this.time_precision,
                force_full_sequence: false
            }
        );
        this.processed_chunks.push({ text: text.trim() });
        createResultMessage(
            this.processed_chunks, false
        );

        // this.processed_chunks = chunks.map((chunk, index) => {
        //     return this.processChunk(chunk, index)
        // })


        // createResultMessage(
        //     this.processed_chunks, false, this.getLastChunkTimestamp()
        // )
    }

    getLastChunkTimestamp() {
        if (this.processed_chunks.length === 0) {
            return 0
        }
    }

    processChunk(chunk, index) {
        // const { text, timestamp } = chunk
        // const [start, end] = timestamp
        // console.log('start', start);
        // console.log('end', end);
        // return {
        //     index,
        //     text: `${text.trim()}`,
        //     start: Math.round(start),
        //     end: Math.round(end) || Math.round(start + this.stride_length_s)
        // }
        const { text } = chunk;
        return {
            index,
            text: `${text.trim()}`,
        }

    }
}

// function createResultMessage(results, isDone, completedUntilTimestamp) {
//     self.postMessage({
//         type: MessageTypes.RESULT,
//         results,
//         isDone,
//         completedUntilTimestamp
//     })
// }

// function createPartialResultMessage(result) {
//     self.postMessage({
//         type: MessageTypes.RESULT_PARTIAL,
//         result
//     })
// }

function createResultMessage(results, isDone) {
    self.postMessage({
        type: MessageTypes.RESULT,
        results: results.slice(-1)[0].text,  // Only send the text of each chunk
        isDone
    });
}

function createPartialResultMessage(result) {
    self.postMessage({
        type: MessageTypes.RESULT_PARTIAL,
        result: {
            text: result.text  // Only send the text
        }
    });
}
