import { Wish } from "../models/wish.model";
import { Document } from "mongoose";

type WishDoc = Document & {
  festival: string;
  lang: string;
  tone: string;
  text: string;
  tags?: string[];
  approved?: boolean;
  author?: string;
};

class WishesService {
  async find(query: Record<string, any>) {
    return Wish.find(query).lean().exec();
  }

  async findApproved(query: Record<string, any>) {
    return Wish.find({ ...query, approved: true }).lean().exec();
  }

  async count(query: Record<string, any>) {
    return Wish.countDocuments(query).exec();
  }

  async findOneSkip(query: Record<string, any>, skip: number) {
    return Wish.findOne(query).skip(skip).lean().exec();
  }

  async findById(id?: string) {
    if (!id) return null;
    return Wish.findById(id).exec();
  }

  async create(data: Record<string, any>) {
    return Wish.create(data);
  }

  async update(id: string | undefined, data: Record<string, any>) {
    if (!id) return null;
    return Wish.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string | undefined) {
    if (!id) return false;
    const res = await Wish.findByIdAndDelete(id).exec();
    return !!res;
  }
}

export default new WishesService();
