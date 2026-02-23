import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const txtModels = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent'));
        console.log("Supported text models:");
        txtModels.forEach(m => console.log(m.name));
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
