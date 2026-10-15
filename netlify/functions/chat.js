
exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json"
  };

  const reply = (statusCode, data) => ({
    statusCode,
    headers,
    body: JSON.stringify(data)
  });

  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return reply(500, {
      error: "OPENAI_API_KEY is not configured"
    });
  }

  try {
    const { level } = JSON.parse(event.body || "{}");

    const instructions = {
      foundation:
        "Create a simple quadratic equation with integer roots and a basic hint.",
      standard:
        "Create a moderate school-level quadratic equation, preferably solved by factoring.",
      advanced:
        "Create a challenging real-world quadratic problem requiring mathematical reasoning."
    };

    const prompt = `
Create one educational quadratic equation task.
Student level: ${level}.
Requirements: ${instructions[level] || instructions.foundation}

Return ONLY valid JSON with exactly these keys:
"problem", "hint", "explanation", "solution".
All values must be strings. Ensure the solution is mathematically correct.
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
      return reply(502, {
        error: result.error?.message || "AI generation failed"
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

    return reply(200, task);

  } catch (error) {
    console.error("Chat API error:", error);
    return reply(500, {
      error: "Could not generate the task"
    });
  }
};
