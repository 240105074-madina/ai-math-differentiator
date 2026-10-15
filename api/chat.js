
module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured"
    });
  }

  try {
    const { level } = req.body || {};

    const instructions = {
      foundation:
        "Create a simple quadratic equation with integer roots and give a helpful basic hint.",
      standard:
        "Create a moderate quadratic equation suitable for school students, preferably solved by factoring.",
      advanced:
        "Create a challenging real-world quadratic problem requiring mathematical reasoning."
    };

    const prompt = `
Create one educational quadratic equation task.
Student level: ${level}.
Requirements: ${instructions[level] || instructions.foundation}

Return ONLY valid JSON with exactly these keys:
"problem", "hint", "explanation", "solution".
All values must be strings. Explain the mathematics correctly.
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: prompt
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", result);
      return res.status(500).json({
        error: "AI generation failed"
      });
    }

const output = result.output
  ?.flatMap(item => item.content || [])
  .find(item => item.type === "output_text")?.text;

if (!output) {
  throw new Error("AI response was empty");
}
    const task = JSON.parse(
      output.replace(/^```json\s*/i, "")
        .replace(/\s*```$/, "")
    );

    return res.status(200).json(task);

  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: "Could not generate the task"
    });
  }
};
