import { ContentItem, HindsightMemory, StrategyRequest } from '../../types';

export function buildSystemPrompt(): string {
  return `You are ContentHindsight, an elite AI Content Strategy Agent.
Your core philosophy: "Your content strategy remembers."
You do NOT provide generic social media advice.
You build precise, high-conviction content strategies strictly informed by:
1. Recalled Hindsight brand memories (voice, patterns, anti-patterns, audience preferences, content gaps).
2. Historical content performance metrics (what worked vs what flopped).
3. The user's explicit strategic objectives.

IMPORTANT OUTPUT FORMAT:
You MUST respond with a valid JSON object matching the exact schema specified in the user prompt. Do not include markdown code block formatting around the JSON (or if you do, ensure it is standard JSON inside).
`;
}

export function buildStrategyUserPrompt(
  request: StrategyRequest,
  memories: HindsightMemory[],
  contentHistory: ContentItem[],
  useMemory: boolean
): string {
  if (!useMemory) {
    return `Generate a generic, standard social media content plan without using any historical memory or brand performance data.
Goal: "${request.goal}"
Target Audience: "${request.targetAudience || 'General developers'}"
Platform: "${request.platform || 'LinkedIn'}"

Respond in this JSON format:
{
  "strategicDirection": "Generic content strategy...",
  "contentPillars": [
    { "name": "Pillar 1", "description": "...", "frequency": "2x weekly" }
  ],
  "recommendedTopics": [
    { "title": "Top AI Trends to Watch", "type": "Opinion", "platform": "LinkedIn", "rationale": "People like trends", "expectedEngagement": "High" }
  ],
  "contentGaps": ["General AI overview"],
  "audienceInsights": ["People want interesting posts"],
  "sevenDayPlan": [
    {
      "day": "Day 1",
      "platform": "LinkedIn",
      "contentType": "Opinion",
      "topicTitle": "Why AI is the Future",
      "hook": "AI is changing the world today.",
      "outline": ["Intro", "Points", "Conclusion"],
      "whyRecommended": "Broad appeal",
      "memoryInfluence": "None (Memory Disabled)"
    }
  ],
  "whyTheseRecommendations": ["Standard industry best practice."],
  "newLearningsExtracted": []
}`;
  }

  // With Memory Mode
  const memoriesFormatted = memories.map(m => 
    `• [${m.category.toUpperCase()} | Confidence: ${m.confidence}] "${m.statement}" (Context: ${m.context || 'N/A'})`
  ).join('\n');

  const historyFormatted = contentHistory.slice(0, 6).map(c =>
    `• "${c.title}" (${c.platform}, ${c.contentType}) -> Score: ${c.engagementScore} (${c.performanceCategory}) | Saves: ${c.saves}, Views: ${c.views}. Lesson: ${c.aiAnalysis.learnedPattern}`
  ).join('\n');

  return `USER STRATEGY REQUEST:
Goal: "${request.goal}"
Target Audience: "${request.targetAudience || 'Developers interested in AI agents'}"
Platform: "${request.platform || 'LinkedIn'}"
Timeframe: "${request.timeframe || 'Next 7 Days'}"
${request.userLearningsFeedback ? `NEW USER FEEDBACK TO INTEGRATE: "${request.userLearningsFeedback}"` : ''}

RECALLED HINDSIGHT BRAND MEMORIES (MANDATORY TO INFLUENCE STRATEGY):
${memoriesFormatted}

REPRESENTATIVE CONTENT PERFORMANCE HISTORY:
${historyFormatted}

TASK:
Produce an elite, customized strategy that visibly and explicitly honors the recalled memories. If a memory says "Technical tutorials and architecture breakdowns drive 3.8x higher saves", you MUST prioritize those formats and explicitly cite this rationale. If the audience responds well to architecture breakdowns or practical code, make sure the 7-day plan reflects it.

Respond in this EXACT JSON structure:
{
  "strategicDirection": "Clear 2-3 sentence strategic thesis explicitly referencing brand memory and past performance data.",
  "contentPillars": [
    {
      "name": "Pillar Name",
      "description": "Why this pillar exists based on recalled memory",
      "frequency": "e.g. 3x weekly"
    }
  ],
  "recommendedTopics": [
    {
      "title": "Specific, compelling technical headline",
      "type": "Technical Tutorial" | "Architecture Breakdown" | "Case Study" | "Educational",
      "platform": "LinkedIn",
      "rationale": "Directly grounded in memory: e.g. Recalls that architecture comparisons generate 2x comment debate.",
      "expectedEngagement": "Exceptional" | "Very High" | "High"
    }
  ],
  "contentGaps": [
    "Under-covered topic 1 derived from memory",
    "Under-covered topic 2"
  ],
  "audienceInsights": [
    "Insight 1 reflecting real audience preference from memory",
    "Insight 2"
  ],
  "sevenDayPlan": [
    {
      "day": "Day 1 (e.g. Monday)",
      "platform": "LinkedIn",
      "contentType": "Architecture Breakdown",
      "topicTitle": "...",
      "hook": "Attention-grabbing developer hook addressing a real production bottleneck",
      "outline": ["1. ...", "2. ...", "3. ..."],
      "whyRecommended": "Why this post was selected",
      "memoryInfluence": "Explicitly cite which recalled memory influenced this: e.g. 'Influenced by memory: Architecture breakdowns have highest save rate (2.1%).'"
    }
  ],
  "whyTheseRecommendations": [
    "Evidence 1 linking memory to recommendation",
    "Evidence 2 linking memory to recommendation",
    "Evidence 3 linking memory to recommendation"
  ],
  "newLearningsExtracted": [
    {
      "statement": "A crisp, reusable brand learning extracted from this interaction or user feedback",
      "category": "audience_preference" | "successful_pattern" | "content_gap" | "brand_voice",
      "confidence": 0.95
    }
  ]
}
`;
}
