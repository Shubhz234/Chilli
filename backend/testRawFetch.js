import dotenv from 'dotenv';
dotenv.config();

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    console.log("Fetching from:", url);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });
        console.log("Status:", response.status, response.statusText);
        const text = await response.text();
        console.log("Body:", text);
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
