import { Request, Response, NextFunction } from "express";
import { Wish } from "../models/wish.model";
import wishesService from "../services/wishes.service";
import { renderTemplate } from "../../../lib/render";
import { success, created, error as respError } from "../../../utils/responseWrapper";

function buildQueryFromQuery(q: Record<string, any>) {
  const { festival, lang, tone } = q;
  const query: any = {};
  if (festival) query.festival = festival;
  if (lang) query.lang = lang;
  if (tone) query.tone = tone;
  return query;
}

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = buildQueryFromQuery(req.query as Record<string, string>);
    const wishes = await wishesService.find(query);
    return success(res, wishes);
  } catch (err) {
    next(err);
  }
};

export const render = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { festival, lang, tone, ...params } = req.query as Record<string, string>;
    const query: any = { approved: true, ...buildQueryFromQuery({ festival, lang, tone }) };

    const templates = await wishesService.findApproved(query);
    if (!templates.length) return respError(res, "No templates found", 404);

    const chosen = templates[Math.floor(Math.random() * templates.length)]!;
    const rendered = renderTemplate(chosen.text, { ...params, year: new Date().getFullYear() });
    return success(res, { template: chosen, rendered });
  } catch (err) {
    next(err);
  }
};

export const random = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = { approved: true, ...buildQueryFromQuery(req.query as Record<string, string>) };
    const count = await wishesService.count(query);
    if (count === 0) return success(res, null);
    const randIndex = Math.floor(Math.random() * count);
    const doc = await wishesService.findOneSkip(query, randIndex);
    return success(res, doc);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  console.log("CREATE REQ BODY:", req.body);
  try {
    const wish = await wishesService.create(req.body);
    return created(res, wish);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await wishesService.update(req.params.id, req.body);
    return success(res, updated);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ok = await wishesService.remove(req.params.id);
    if (!ok) return respError(res, "Not found", 404);
    return success(res, { deleted: req.params.id });
  } catch (err) {
    next(err);
  }
};
