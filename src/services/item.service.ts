import Item, { ItemDocument } from "../models/item.model";

type CreateItemDto = {
  name: string;
  // when using `exactOptionalPropertyTypes`, optional props may not accept `undefined` unions
  // make the possibility explicit so callers with `string | undefined` are accepted
  description?: string | undefined;
};

type UpdateItemDto = Partial<CreateItemDto>;

class ItemService {
  async create(data: CreateItemDto): Promise<ItemDocument> {
    const item = await Item.create(data);
    return item;
  }

  async findAll(): Promise<ItemDocument[]> {
    return Item.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string | undefined): Promise<ItemDocument | null> {
    if (!id) return null;
    return Item.findById(id).exec();
  }

  async update(id: string | undefined, data: UpdateItemDto | Record<string, any>): Promise<ItemDocument | null> {
    if (!id) return null;
    return Item.findByIdAndUpdate(id, data as any, { new: true }).exec();
  }

  async remove(id: string | undefined): Promise<boolean> {
    if (!id) return false;
    const res = await Item.findByIdAndDelete(id).exec();
    return !!res;
  }
}

export default new ItemService();
