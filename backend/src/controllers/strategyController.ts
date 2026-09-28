import { Request, Response } from 'express';
import { strategyService } from '../services/strategy/strategyService';
import { ApiResponse, StrategyResult } from '../types';

export const generateStrategy = async (req: Request, res: Response) => {
  try {
    const { goal, targetAudience, platform, timeframe, userLearningsFeedback, useMemory } = req.body;

    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Goal is required to generate strategy.' }
      });
    }

    const strategy = await strategyService.buildStrategy({
      goal,
      targetAudience,
      platform,
      timeframe,
      userLearningsFeedback,
      useMemory: useMemory !== undefined ? Boolean(useMemory) : true
    });

    const response: ApiResponse<StrategyResult> = {
      success: true,
      data: strategy,
      meta: {
        hindsightConnected: true,
        groqConnected: Boolean(process.env.GROQ_API_KEY),
        timestamp: new Date().toISOString()
      }
    };
    return res.json(response);
  } catch (error: any) {
    console.error('Error generating strategy:', error);
    return res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to generate content strategy' }
    });
  }
};
