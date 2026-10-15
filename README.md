# AI Math Differentiator

An educational web application that adapts one core mathematics concept—quadratic equations—into three differentiated learning levels.

## Levels
- Foundation: simplified numbers, explicit scaffolding, direct hints.
- Standard: grade-level problem solving with moderate support.
- Advanced: multi-step/real-world reasoning with less scaffolding.

## Tech
HTML, CSS, JavaScript, Vercel serverless function, OpenAI Responses API.

## Run locally
1. Install Node.js.
2. Run `npm install`.
3. Set `OPENAI_API_KEY` as an environment variable. Never put the key in browser JavaScript or GitHub.
4. Deploy to Vercel or run with a compatible Vercel development environment.

## AI prompt design
The backend uses level-specific system instructions so the same quadratic-equation concept is transformed by number complexity, scaffolding, context, hints, and reasoning demands.

## Academic integrity
The interface is designed as a learning aid: learners can request hints and explanations instead of only receiving an answer. Mathematical outputs should be checked during testing before submission.
