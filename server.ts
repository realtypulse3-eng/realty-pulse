import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Agent Endpoint
  app.post('/api/gemini/agent', async (req, res) => {
    try {
      const { agentType, prompt, context } = req.body;

      if (!agentType || !prompt) {
        res.status(400).json({ error: 'agentType and prompt are required.' });
        return;
      }

      const ai = getAiClient();

      const systemInstruction = `
You are the "${agentType}" in RealtyPulse, an enterprise AI Real Estate Operating System & CRM.

CRITICAL OPERATIONAL RULES:
1. STRICT DATA HONESTY: Never fabricate properties, leads, revenue, deals, or metrics. All statements regarding figures must be derived directly from the provided database context.
2. DISTINGUISH OUTPUT TYPES: Clearly distinguish between:
   - [DATABASE FACT]: Unmodified records from the database.
   - [CALCULATED METRIC]: Mathematical aggregations (e.g., sums, averages, counts, conversion rates).
   - [AI RECOMMENDATION]: Strategic suggestions for human agents to consider.
   - [AI GENERATED CONTENT]: Marketing copy, descriptions, or message drafts.
3. HUMAN APPROVAL SAFEGUARDS: If an action involves sending external emails/messages, deleting records, altering prices, or creating high-impact commitments, mark the response with "REQUIRES_APPROVAL: true" and provide a structured "approvalDetails" object.
4. TONE & CRAFT: Professional, crisp, executive, analytical, and concise real-estate terminology.

Context provided from live database:
${JSON.stringify(context || {}, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      const responseText = response.text || 'No response generated.';

      // Check if human approval is requested
      const requiresApproval = responseText.includes('REQUIRES_APPROVAL: true') || responseText.includes('[REQUIRES APPROVAL]');

      res.json({
        success: true,
        responseText,
        requiresApproval,
        agentType,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Agent Execution Error:', err);
      res.status(500).json({
        error: err.message || 'An error occurred during AI agent execution.',
        fallbackNotice: 'Ensure GEMINI_API_KEY is properly set in environment secrets.',
      });
    }
  });

  // Vite Middleware in Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RealtyPulse Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
