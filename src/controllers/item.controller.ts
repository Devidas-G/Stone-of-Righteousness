import { Request, Response, NextFunction } from "express";
import itemService from "../services/item.service";
import {
  createItemSchema,
  updateItemSchema,
  objectIdSchema,
} from "../validation/item.schema";
import { success, created, error as respError } from "../utils/responseWrapper";

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parse = createItemSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ errors: parse.error.format() });
    const data = parse.data;
    const item = await itemService.create({ ...data, description: data.description ?? "" });
    return created(res, item);
  } catch (err) {
    next(err);
  }
};

export const getItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await itemService.findAll();
    return success(res, items);
  } catch (err) {
    next(err);
  }
};

export const getItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const parse = objectIdSchema.safeParse(id);
    if (!parse.success) return res.status(400).json({ errors: parse.error.format() });
    const item = await itemService.findById(parse.data);
    if (!item) return respError(res, "Item not found", 404);
    return success(res, item);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const idParse = objectIdSchema.safeParse(id);
    if (!idParse.success) return res.status(400).json({ errors: idParse.error.format() });

    const bodyParse = updateItemSchema.safeParse(req.body);
    if (!bodyParse.success) return res.status(400).json({ errors: bodyParse.error.format() });

    // Remove undefined properties so types match Partial<CreateItemDto> (no `undefined` unions)
    const updateData = Object.fromEntries(
      Object.entries(bodyParse.data).filter(([, v]) => v !== undefined)
    );

    const item = await itemService.update(idParse.data, updateData as any);
    if (!item) return respError(res, "Item not found", 404);
    return success(res, item);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const idParse = objectIdSchema.safeParse(id);
    if (!idParse.success) return res.status(400).json({ errors: idParse.error.format() });

    const ok = await itemService.remove(idParse.data);
    if (!ok) return respError(res, "Item not found", 404);
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
