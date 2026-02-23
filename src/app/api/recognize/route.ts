import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const PROMPT = `Analyze this image and identify all visible food ingredients.
Return ONLY a valid JSON array of ingredient names in lowercase English.
Each item should be a common cooking ingredient name (e.g. "chicken breast", "garlic", "onion", "tomato").
Do not include brand names, packaging, or non-food items.
If no food ingredients are visible, return an empty array [].`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing GEMINI_API_KEY" },
      { status: 500 }
    );
  }

  let base64Image: string;
  let mimeType: string;

  try {
    const body = await req.json();
    base64Image = body.image;
    mimeType = body.mimeType ?? "image/jpeg";

    if (!base64Image || typeof base64Image !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'image' field (expected base64 string)" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  try {
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: PROMPT },
              {
                inlineData: {
                  mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!geminiRes.ok) {
      const status = geminiRes.status;
      const errText = await geminiRes.text().catch(() => "Unknown error");

      if (status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again in a moment." },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: `Gemini API error (${status}): ${errText.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const text: string =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const jsonMatch = text.match(/\[[\s\S]*?\]/);
    if (!jsonMatch) {
      return NextResponse.json({ ingredients: [] });
    }

    const parsed: unknown = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) {
      return NextResponse.json({ ingredients: [] });
    }

    const ingredients: string[] = parsed
      .filter((item): item is string => typeof item === "string")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0 && s.length < 100);

    return NextResponse.json({ ingredients });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to process image: ${message}` },
      { status: 500 }
    );
  }
}
