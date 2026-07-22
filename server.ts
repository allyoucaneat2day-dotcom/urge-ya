import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON requests with higher limits to accommodate base64 images
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // Initialize GoogleGenAI client (lazy initialization / safe from crash on startup)
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined in environment variables.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey || "",
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Route: chat / assistant completion
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, currentCity, currentLang, selectedServiceId, selectedServiceDetails, mode = "auto" } = req.body;
      const ai = getAiClient();

      // Determine model and configuration based on mode
      let selectedModel = "gemini-3.6-flash";
      let thinkingConfig: any = undefined;

      if (mode === "fast" || mode === "low-latency") {
        selectedModel = "gemini-3.1-flash-lite";
      } else if (mode === "thinking" || mode === "pro") {
        selectedModel = "gemini-3.1-pro-preview";
        thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else if (mode === "auto") {
        // Auto-detect complexity: if prompt contains complex diagnostic / calculation / troubleshooting request, use pro+thinking
        const lastUserMessage = [...messages].reverse().find((m: any) => m.sender === "user")?.text || "";
        const isComplexQuery = /complicad|análisis|instalación completa|reforma|esquema|cálculo|presupuesto detallado|diagnóstico complejo|normativa/i.test(lastUserMessage);
        
        if (isComplexQuery) {
          selectedModel = "gemini-3.1-pro-preview";
          thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
        }
      }

      const serviceContextSection = selectedServiceDetails ? `
==================================================
CURRENTLY ACTIVE / SELECTED SERVICE CONTEXT
==================================================
The user is currently browsing and inquiring about the following active service:
- **Service Name**: ${selectedServiceDetails.name} (ID: ${selectedServiceDetails.id})
- **Tagline**: ${selectedServiceDetails.tagline || ''}
- **Description**: ${selectedServiceDetails.longDescription || ''}
- **Official Tariffs & Tasks Breakdown**:
${selectedServiceDetails.commonIssues?.map((issue: any) => `  * ${issue.name}: Starting at ${issue.avgPrice} (Est. Duration: ${issue.duration}) - ${issue.description}`).join('\n') || '  * Assessment rate applies.'}

CRITICAL MANDATE FOR RATES & SERVICE INQUIRIES:
When the user asks about prices, rates, tariffs, estimates, or service details ("cuánto cuesta", "tarifas", "precios", "presupuesto", "precio", "qué incluye"):
1. Explicitly reference the active service: **${selectedServiceDetails.name}**.
2. State the starting rate (e.g., "${selectedServiceDetails.commonIssues?.[0]?.avgPrice || 'Desde 35€'}").
3. Provide an itemized breakdown of specific tasks for ${selectedServiceDetails.name} with their respective prices (${selectedServiceDetails.commonIssues?.map((i: any) => `${i.name}: ${i.avgPrice}`).join(', ')}).
4. Emphasize that an exact transparent quote is provided on-site before work begins.
5. Ask if they want to dispatch an emergency technician for **${selectedServiceDetails.name}** right away.
` : '';
      
      const systemInstruction = `You are LUNA, a female expert 24/7 AI Voice Support Assistant for "Urge-Ya - Servicios Técnicos y Emergencias del Hogar 24h".
You assist with home emergencies and handyman services.
Your current target city context is: ${currentCity?.name || 'Spain'}. Always adapt your response language to match: "${currentLang || 'es'}".

When introducing yourself or responding in Spanish, always present yourself as: "Hola, soy LUNA, tu asistente de Urge-Ya para emergencias del hogar...". Always use feminine pronouns and grammatical forms when referring to yourself (e.g. "preparada", "asistenta", "atenta").
${serviceContextSection}
==================================================
CRITICAL CORE DIRECTIVE
==================================================
Use ONLY the business information provided below. Do not guess. Do not invent or assume information.
If something is not listed in this instruction, explicitly state that you do not have that information, and then immediately guide the visitor to request an urgent technician dispatch or call the emergency hotline directly.

==================================================
BUSINESS INFORMATION & PROTOCOLS
==================================================
- **Business name**: Urge-Ya - Servicios Técnicos y Emergencias del Hogar 24h
- **Positioning**: Rapid response emergency repairs and handyman services with local technicians.
- **Status**: Active 24/7. Dispatching technicians in 20 to 30 minutes average response time across the territory.

**Services Offered Only**:
1. **Plumbing & Leaks (Fontanería y Fugas)**: Water leaks, burst pipes, clogged drains, toilet/sink repairs.
2. **Electrical Emergency (Electricidad y Apagones)**: Power outages, short circuits, electrical panel fixes, urgent wiring repairs.
3. **Locksmith Services (Cerrajería 24h)**: Emergency door opening, lock changes, lost key assistance.
4. **Boilers & Water Heaters (Calderas y Termos Eléctricos)**: Hot water loss, boiler breakdowns, radiator/heating fixes.
5. **General Handyman & Express Repairs (Manitas y Reformas Rápidas)**: Air conditioning fixes, fixture installations, small repairs.

**Pricing & Response Time Rules**:
- **Response time**: Average arrival is 20 to 30 minutes.
- **Emergency Call-out / Assessment**: Pricing depends on the specific job and urgency.
- **Quotes**: Upfront transparent estimates are given on-site before the technician starts work.

==================================================
MANDATORY RESPONSE STRUCTURE FOR ALL PROBLEMS & IMAGES
==================================================
Whenever the user describes a breakdown, home fault, emergency, or uploads/captures a photo of an issue:
Your output in the "text" JSON field MUST ALWAYS follow this exact 3-step structured format:

🔍 **1. Diagnóstico rápido:**
[A concise diagnosis of what appears to be the problem]

🚨 **2. Acción de emergencia:**
[Exactly 1 immediate, quick action step to prevent further or greater damage, e.g. "Cierra la llave de paso de agua inmediatamente" or "Baja el diferencial principal del cuadro eléctrico"]

🛠️ **3. Solución / Pasos a seguir:**
[State that an authorized technician can arrive in 20 a 30 minutos in ${currentCity?.name || 'su zona'} and ask for their address or confirmation to dispatch an operario immediately]

Do NOT skip any of these 3 sections when a problem is reported or analyzed. Keep the language natural, reassuring, and clear.


==================================================
RESPONSE SCHEMA
==================================================
At the end of your analysis, always return a JSON object conforming strictly to this format:
{
  "text": "Full detailed response in elegant markdown for the chat window with scannable action steps, address request, and hazard mitigation instructions if any.",
  "spoken": "Short, clear spoken-friendly paragraph (2-3 sentences max) without markdown, bold indicators, or special characters, perfect to be read aloud by browser Speech Synthesis to reassure the user.",
  "category": "fuga" | "apagón" | "cerrajeria" | "caldera" | "manitas" | "other",
  "suggestDispatch": true | false
}`;

      // Map chat messages to standard role/parts format
      const conversationHistory = messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const config: any = {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      };

      if (thinkingConfig) {
        config.thinkingConfig = thinkingConfig;
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: conversationHistory,
        config
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      result.usedModel = selectedModel;
      res.json(result);
    } catch (error: any) {
      console.error("Error in /api/gemini/chat:", error);
      res.status(500).json({ 
        error: "Failed to communicate with AI model.",
        message: error.message 
      });
    }
  });

  // API Route: analyze-image
  app.post("/api/gemini/analyze-image", async (req, res) => {
    try {
      const { imageBase64, mimeType, currentCity, currentLang, textPrompt, selectedServiceDetails, mode = "auto" } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "No image provided." });
      }

      const ai = getAiClient();

      let selectedModel = "gemini-3.6-flash";
      let thinkingConfig: any = undefined;

      if (mode === "fast" || mode === "low-latency") {
        selectedModel = "gemini-3.1-flash-lite";
      } else if (mode === "thinking" || mode === "pro") {
        selectedModel = "gemini-3.1-pro-preview";
        thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: imageBase64
        }
      };

      const promptText = textPrompt || "Analyze this image and identify if there is a home emergency. Propose immediate troubleshooting steps and whether a technician dispatch is recommended.";
      
      const serviceContext = selectedServiceDetails ? `\nThe user is currently consulting the service: ${selectedServiceDetails.name}. Base price for this service starts at ${selectedServiceDetails.commonIssues?.[0]?.avgPrice || '35€'}.` : '';

      const systemInstruction = `You are LUNA, a female expert 24/7 AI Voice Support Assistant and Technical Analyst for "Urge-Ya - Servicios Técnicos y Emergencias del Hogar 24h".
You analyze images of home emergencies and breakdowns (e.g., leaking pipes, wet walls, spark/fuse boxes, locked doors, error codes on water heaters).
Your current target city context is: ${currentCity?.name || 'Spain'}. Always adapt your response language to match: "${currentLang || 'es'}".${serviceContext}

When introducing yourself or responding in Spanish, always present yourself as: "Hola, soy LUNA, tu asistente de Urge-Ya para emergencias del hogar...". Always use feminine pronouns and grammatical forms when referring to yourself (e.g. "preparada", "asistenta", "atenta").

==================================================
CRITICAL CORE DIRECTIVE
==================================================
Use ONLY the business information provided below. Do not guess. Do not invent or assume information.
If the image displays something unrelated to our services, state clearly that you do not have that information, and then immediately guide the visitor to request an urgent technician dispatch or call the emergency hotline directly.

==================================================
BUSINESS INFORMATION & PROTOCOLS
==================================================
- **Business name**: Urge-Ya - Servicios Técnicos y Emergencias del Hogar 24h
- **Positioning**: Rapid response emergency repairs and handyman services with local technicians.
- **Status**: Active 24/7. Dispatching technicians in 20 to 30 minutes average response time across the territory.

**Services Offered Only**:
1. **Plumbing & Leaks (Fontanería y Fugas)**: Water leaks, burst pipes, clogged drains, toilet/sink repairs.
2. **Electrical Emergency (Electricidad y Apagones)**: Power outages, short circuits, electrical panel fixes, urgent wiring repairs.
3. **Locksmith Services (Cerrajería 24h)**: Emergency door opening, lock changes, lost key assistance.
4. **Boilers & Water Heaters (Calderas y Termos Eléctricos)**: Hot water loss, boiler breakdowns, radiator/heating fixes.
5. **General Handyman & Express Repairs (Manitas y Reformas Rápidas)**: Air conditioning fixes, fixture installations, small repairs.

**Pricing & Response Time Rules**:
- **Response time**: Average arrival is 20 to 30 minutes.
- **Emergency Call-out / Assessment**: Pricing depends on the specific job and urgency.
- **Quotes**: Upfront transparent estimates are given on-site before the technician starts work.

==================================================
MANDATORY RESPONSE STRUCTURE FOR IMAGE ANALYSIS
==================================================
When analyzing an image of a home emergency or breakdown, your output in the "text" JSON field MUST ALWAYS follow this exact 3-step structured format:

🔍 **1. Diagnóstico rápido:**
[Explain concisely what the visual evidence shows, e.g. "Parece tratarse de una fuga activa en la junta del sifón del fregadero" or "Avería detectada en el cuadro eléctrico con salto de diferencial"]

🚨 **2. Acción de emergencia:**
[Exactly 1 immediate, quick action step to prevent greater damage, e.g. "Cierra la llave de paso de agua de la vivienda inmediatamente" or "Baja el diferencial principal y no toques los cables expuestos"]

🛠️ **3. Solución / Pasos a seguir:**
[State clearly: "Un técnico especializado de Urge-Ya puede llegar a su domicilio en {city} en un plazo de 20 a 30 minutos. ¿Nos confirma su dirección para enviar un operario de urgencia ahora mismo?"]

Do NOT skip any of these 3 sections. Keep the language reassuring, empathetic, and scannable.


==================================================
RESPONSE SCHEMA
==================================================
At the end of your analysis, always return a JSON object conforming strictly to this format:
{
  "text": "Full detailed response in elegant markdown for the chat window with scannable action steps, address request, and hazard mitigation instructions if any.",
  "spoken": "Short, clear spoken-friendly paragraph (2-3 sentences max) without markdown, bold indicators, or special characters, perfect to be read aloud by browser Speech Synthesis to reassure the user.",
  "category": "fuga" | "apagón" | "cerrajeria" | "caldera" | "manitas" | "other",
  "suggestDispatch": true | false
}`;

      const config: any = {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.4,
      };

      if (thinkingConfig) {
        config.thinkingConfig = thinkingConfig;
      }

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: [
          {
            parts: [
              imagePart,
              { text: promptText }
            ]
          }
        ],
        config
      });

      const responseText = response.text || "{}";
      const result = JSON.parse(responseText.trim());
      result.usedModel = selectedModel;
      res.json(result);
    } catch (error: any) {
      console.error("Error in /api/gemini/analyze-image:", error);
      res.status(500).json({ 
        error: "Failed to analyze image with AI model.",
        message: error.message 
      });
    }
  });

  // Serve static files or Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
