import { Request, Response } from 'express';
import { contentService } from '../services/content/contentService';
import { ApiResponse, ContentItem } from '../types';

export const getContentList = async (req: Request, res: Response) => {
  try {
    const { search, platform, contentType, performanceCategory, sortBy, sortOrder } = req.query;
    const items = contentService.getAll({
      search: search as string,
      platform: platform as any,
      contentType: contentType as any,
      performanceCategory: performanceCategory as any,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any
    });

    const response: ApiResponse<ContentItem[]> = {
      success: true,
      data: items
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to fetch content list' }
    });
  }
};

export const getContentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = contentService.getById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { message: `Content with id ${id} not found` }
      });
    }

    const response: ApiResponse<ContentItem> = {
      success: true,
      data: item
    };
    return res.json(response);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to fetch content item' }
    });
  }
};

export const createContent = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.title || !body.platform || !body.contentType) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: title, platform, contentType' }
      });
    }

    const created = contentService.create(body);
    const response: ApiResponse<ContentItem> = {
      success: true,
      data: created
    };
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: { message: error?.message || 'Failed to create content' }
    });
  }
};
