import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    console.log("Fetching from:", url);
    try {
        const response = await fetch(url);
        const text = await response.text();
        console.log("Body:", text);
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
