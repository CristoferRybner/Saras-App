import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Effectuation system prompt for Socratic Venture Counseling
const EFFECTUATION_SYSTEM_INSTRUCTION = `
You are Professor Sarasvathy and the Effectuation Venture Counselor—an intellectual, warm, Socratic advisor guiding founders using the 5 Principles of Effectuation:
1. Bird-in-Hand (Start with your means: Who I am, What I know, Whom I know).
2. Affordable Loss (Invest only what you can afford to lose; prioritize downside risk over predicted upside).
3. Crazy Quilt (Form partnerships with self-selected stakeholders who make actual pre-commitments, co-creating the market).
4. Lemonade (Embrace surprises, rejections, and contingencies as inputs to pivot and expand).
5. Pilot-in-the-Plane (Focus on actions within human agency and control rather than predicting uncontrollable future trends).

Your Voice and Tone:
- Calm, seasoned venture counselor rather than an urgent task tracker.
- Warm editorial ethos: thoughtful, articulate, dignified, provocative yet deeply encouraging.
- Never use tech-bro buzzwords ("synergy", "crushing it", "10x").
- Ask catalytic Socratic questions that force the founder to look at their immediate reality, tangible contacts, and affordable experiments.

Output Format:
You must respond with valid JSON matching this schema:
{
  "message": "Your rich, formatted markdown response. Use bold, quotes, and italics where fitting. Include a poignant catalytic question at the end.",
  "speechText": "A 1-2 sentence concise version of your thought, suitable for the avatar to read aloud naturally without markdown.",
  "avatarMood": "reflective" | "probing" | "synthesizing" | "catalytic" | "encouraging",
  "activePrinciple": "Bird-in-Hand" | "Affordable Loss" | "Crazy Quilt" | "Lemonade" | "Pilot-in-the-Plane",
  "extractedItems": [
    {
      "category": "means_who_i_am" | "means_what_i_know" | "means_whom_i_know" | "affordable_loss" | "crazy_quilt" | "lemonade" | "pilot_action",
      "title": "Short title (under 8 words)",
      "detail": "Nuanced context from user statement",
      "actionable": boolean
    }
  ],
  "suggestedPrompts": [
    "Short suggested reply or follow-up question 1",
    "Short suggested reply or follow-up question 2",
    "Short suggested reply or follow-up question 3"
  ]
}
`;

// Helper fallback when API is not reachable
function generateFallbackResponse(userMessage: string, historyLength: number) {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('partner') || lower.includes('customer') || lower.includes('network') || lower.includes('quilt')) {
    return {
      message: `In Effectuation, we do not conduct cold market research on hypothetical customers. We stitch the **Crazy Quilt**.\n\n> *"The effectual venture is not defined by an abstract market segment, but by the tangible commitments of people willing to step into the arena with you."*\n\nWho in your immediate periphery could you invite to make an actual commitment—not mere praise, but a pre-order, an introduction, or co-development time?`,
      speechText: "Effectual ventures aren't built on abstract segments, but on tangible commitments. Who in your immediate network can make a small real commitment today?",
      avatarMood: "probing",
      activePrinciple: "Crazy Quilt",
      extractedItems: [
        {
          category: "crazy_quilt",
          title: "Crazy Quilt Stakeholder Outreach",
          detail: "Identify a trusted contact willing to co-create or pre-commit rather than conduct speculative surveys.",
          actionable: true,
        }
      ],
      suggestedPrompts: [
        "What kind of commitment should I ask for first?",
        "I don't know many industry insiders yet—what do I do?",
        "How do I protect my idea when inviting partners?"
      ]
    };
  }

  if (lower.includes('risk') || lower.includes('money') || lower.includes('quit') || lower.includes('budget') || lower.includes('fail')) {
    return {
      message: `Let us anchor in the **Affordable Loss Principle**.\n\nManagerial thinking calculates *expected return* based on forecasts that are almost inevitably inaccurate. Effectual entrepreneurs calculate *affordable loss*:\n\n* What is the exact amount of capital you are willing to lose without jeopardizing your family or solvency?\n* How much time (say, 3 months, 6 months) can you dedicate freely?\n* What is your psychological tolerance for a public experiment?\n\nOnce that downside is capped, fear ceases to paralyze you. What is your honest downside limit today?`,
      speechText: "Effectual founders don't gamble on predicted returns. They calculate their affordable loss: money, time, and reputation they can freely afford to spend.",
      avatarMood: "reflective",
      activePrinciple: "Affordable Loss",
      extractedItems: [
        {
          category: "affordable_loss",
          title: "Founder Downside Boundary",
          detail: "Calculate financial, time, and emotional limits to act with zero existential fear.",
          actionable: true,
        }
      ],
      suggestedPrompts: [
        "Help me define my 90-day affordable loss limit",
        "How do I balance part-time exploration with my job?",
        "What if my affordable capital is zero?"
      ]
    };
  }

  if (lower.includes('problem') || lower.includes('surprise') || lower.includes('rejected') || lower.includes('failed') || lower.includes('pivot')) {
    return {
      message: `You have encountered what Sarasvathy terms the **Lemonade Principle**.\n\nIn a causal mindset, surprises and rejections are viewed as deviations or failures. In the effectual mindset, surprises are raw material. When a door slams, it reveals unexpected physics about the room.\n\nWhat did this surprise or friction tell you that you could not have known through planning alone? How might this exact constraint become your core differentiator?`,
      speechText: "Surprises and rejections aren't deviations in effectuation—they are the clay from which new venture directions are molded.",
      avatarMood: "catalytic",
      activePrinciple: "Lemonade",
      extractedItems: [
        {
          category: "lemonade",
          title: "Contingency Reframe",
          detail: "Convert the current roadblock into an unannounced asset or unique customer insight.",
          actionable: true,
        }
      ],
      suggestedPrompts: [
        "How can I turn this rejection into an advantage?",
        "Show me an example of the Lemonade principle in practice",
        "Should I pivot now or persevere?"
      ]
    };
  }

  // Default Bird-in-Hand / Socratic exploration
  return {
    message: `Let us begin with the sovereign ground: **Bird-in-Hand**.\n\nEvery enduring entrepreneurial journey starts not with goals, but with **Means**:\n1. **Who you are:** Your idiosyncrasies, values, tastes, and obsessions.\n2. **What you know:** Your tacit knowledge, hard-won insights, and unique domain curiosities.\n3. **Whom you know:** Your personal, professional, and unconventional network.\n\nTell me about your background and what you are drawn to build. What are the distinct assets sitting in your hands right now?`,
    speechText: "Every enduring venture begins with who you are, what you know, and whom you know. Tell me: what distinct assets are in your hands right now?",
    avatarMood: "encouraging",
    activePrinciple: "Bird-in-Hand",
    extractedItems: [
      {
        category: "means_who_i_am",
        title: "Founder Identity & Drive",
        detail: userMessage.slice(0, 80) || "Articulating intrinsic motives and capabilities.",
        actionable: false,
      }
    ],
    suggestedPrompts: [
      "Here is my background and professional skill set",
      "I have a specific problem I keep obsessing over",
      "I want to map out who I know and where I can start"
    ]
  };
}

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history = [], workspaceState } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!aiClient) {
    const fallback = generateFallbackResponse(message, history.length);
    return res.json(fallback);
  }

  try {
    const conversationContext = history
      .slice(-6)
      .map((item: { sender: string; text: string }) => `${item.sender === 'user' ? 'Founder' : 'Counselor'}: ${item.text}`)
      .join('\n\n');

    const workspaceSnapshot = workspaceState ? JSON.stringify(workspaceState) : 'Empty workspace';

    const prompt = `
Current Effectuation Workspace State:
${workspaceSnapshot}

Recent Conversation History:
${conversationContext}

Founder's New Reflection:
"${message}"

Provide your Socratic, effectual counseling guidance and extract any newly identified means, losses, partners, surprises, or pilot actions.
Return pure JSON with the exact specified schema.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: EFFECTUATION_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Regex recovery if JSON wrapping occurred
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        parsed = generateFallbackResponse(message, history.length);
      }
    }

    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/chat Gemini call:', err);
    const fallback = generateFallbackResponse(message, history.length);
    return res.json(fallback);
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!aiClient,
    framework: 'Effectuation Editorial Engine',
  });
});

// Mount Vite or static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Editorial Effectuation server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
