const OpenAI = require('openai');
module.exports = async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 try{
  const {level='foundation'}=req.body||{};
  const prompts={foundation:'Create a beginner quadratic-equation problem. Use simple numbers, a familiar context, step-by-step scaffolding, one direct hint, and a complete correct solution.',standard:'Create a grade-level quadratic-equation problem. Use standard curriculum difficulty, moderate scaffolding, one useful hint, and a complete correct solution.',advanced:'Create a challenging quadratic-equation problem, preferably a multi-step real-world application. Require reasoning, give only a strategic hint, and provide a complete correct solution.'};
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const response=await client.responses.create({model:process.env.OPENAI_MODEL||'gpt-5.6-luna',input:[{role:'system',content:'You are a careful mathematics tutor. Verify every algebraic step. Return valid JSON with exactly four string fields: problem, hint, explanation, solution.'},{role:'user',content:prompts[level]||prompts.foundation}]});
  const text=response.output_text.trim().replace(/^```json|```$/g,'').trim();
  return res.status(200).json(JSON.parse(text));
 }catch(err){return res.status(500).json({error:'AI request failed',details:err.message});}
};
