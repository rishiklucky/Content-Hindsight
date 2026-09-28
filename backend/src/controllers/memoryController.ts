import { Request, Response } from 'express';
import { hindsightService } from '../services/hindsight/hindsightService';
import { ApiResponse, HindsightMemory, RecallResult } from '../types';

export const getAllMemories = async (req: Request, res: Response) => {
  try {
    const memories = await hindsightService.getAllMemories();
    const status = hindsightService.getStatus();

    const response: ApiResponse<{ memories: HindsightMemory[]; status: any }> = {
      success: true,
      data: {
        memories,
        status
      },
      meta: {
        hindsightConnected: status.isConfigured || status.provider === 'hindsight_embedded',
        groqConnected: Boolean(process.env.GROQ_API_KEY),
        timestamp: new Date().toISOString()
      }
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: error?.message || 'Memory temporarily unavailable.' }
    });
  }
};

export const recallMemories = async (req: Request, res: Response) => {
  try {
    const { query, limit, categories } = req.body;
    if (!query) {
      return res.status(400).json({
        success: false,
        error: { message: 'Query is required for memory recall.' }
      });
    }

    const recallResult = await hindsightService.recallMemories(query, {
      limit: limit ? Number(limit) : 4,
      categories
    });

    const response: ApiResponse<RecallResult> = {
      success: true,
      data: recallResult
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: 'Memory temporarily unavailable.' }
    });
  }
};

export const retainMemory = async (req: Request, res: Response) => {
  try {
    const { statement, category, context, confidence, tags } = req.body;
    if (!statement || typeof statement !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Statement is required to retain memory.' }
      });
    }

    const retained = await hindsightService.retainMemory({
      statement,
      category,
      context,
      confidence: confidence ? Number(confidence) : 0.95,
      tags: Array.isArray(tags) ? tags : undefined,
      source: 'user_feedback'
    });

    const response: ApiResponse<HindsightMemory> = {
      success: true,
      data: retained
    };
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to retain memory in Hindsight.' }
    });
  }
};

export const deleteMemory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await hindsightService.deleteMemory(id);
    return res.json({
      success: true,
      data: { deleted }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to delete memory.' }
    });
  }
};

export const resetMemories = async (_req: Request, res: Response) => {
  try {
    await hindsightService.resetMemoriesToDefault();
    const memories = await hindsightService.getAllMemories();
    return res.json({
      success: true,
      data: { memories, message: 'Memories reset to baseline.' }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to reset memories.' }
    });
  }
};
