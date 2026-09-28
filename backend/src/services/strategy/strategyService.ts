import { StrategyRequest, StrategyResult } from '../../types';
import { hindsightService } from '../hindsight/hindsightService';
import { groqService } from '../groq/groqService';
import { contentService } from '../content/contentService';

export class StrategyService {
  /**
   * Execute the end-to-end Strategy loop:
   * 1. Check if user passed new feedback -> Retain into Hindsight first
   * 2. Recall relevant Hindsight memories (or skip if useMemory === false)
   * 3. Collect content history context
   * 4. Call Groq with contextual knowledge
   * 5. Extract newly discovered learnings from the generated strategy and auto-retain them in Hindsight
   */
  async buildStrategy(request: StrategyRequest): Promise<StrategyResult> {
    const useMemory = request.useMemory !== false; // default true

    // Step 1: If user provided immediate feedback to incorporate, retain it right away
    if (request.userLearningsFeedback && request.userLearningsFeedback.trim().length > 0) {
      await hindsightService.retainMemory({
        statement: request.userLearningsFeedback.trim(),
        context: `Feedback provided during strategy request: "${request.goal.slice(0, 60)}"`,
        source: 'user_feedback',
        confidence: 0.98
      });
    }

    // Step 2: Recall relevant memories from Hindsight
    let recalledMemories: import('../../types').HindsightMemory[] = [];
    if (useMemory) {
      const recallQuery = `${request.goal} ${request.targetAudience || ''} ${request.platform || ''} ${request.userLearningsFeedback || ''}`;
      const recallResponse = await hindsightService.recallMemories(recallQuery, { limit: 5 });
      recalledMemories = recallResponse.recalledMemories;
    }

    // Step 3: Collect relevant content history
    const allContent = contentService.getAll({ sortBy: 'engagementScore', sortOrder: 'desc' });

    // Step 4: Call Groq service with full memory context
    const strategy = await groqService.generateStrategy(
      request,
      recalledMemories,
      allContent,
      useMemory
    );

    // Step 5: If with_memory, identify high-confidence new learnings and retain them
    if (useMemory && strategy.newLearningsExtracted && strategy.newLearningsExtracted.length > 0) {
      for (const learning of strategy.newLearningsExtracted) {
        if (learning.confidence >= 0.90) {
          // Avoid duplicate statements
          const existing = await hindsightService.getAllMemories();
          const alreadyExists = existing.some(
            m => m.statement.toLowerCase() === learning.statement.toLowerCase()
          );
          if (!alreadyExists) {
            await hindsightService.retainMemory({
              statement: learning.statement,
              category: learning.category,
              confidence: learning.confidence,
              source: 'agent_reflection',
              context: `Auto-extracted insight from strategy session for goal: "${request.goal.slice(0, 50)}"`
            });
          }
        }
      }
    }

    return strategy;
  }
}

export const strategyService = new StrategyService();
