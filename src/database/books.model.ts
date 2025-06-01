import { Document, Schema, InferSchemaType, Model } from "mongoose";
import createModel from "./createModel";

//---------------------------------------------------------------------------
const booksSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true, unique: true },
  price: { type: String, required: true },
  publishedDate: { type: Date, required: true },
});

//---------------------------------------------------------------------------
export interface IBooks {
  id: string;
  title: string;
  author: string;
  price: string;
  publishedDate: Date;
}

//---------------------------------------------------------------------------
export interface IBooksSchema
  extends InferSchemaType<typeof booksSchema>,
    Document {}

interface IBooksModel extends Model<IBooksSchema> {}

//---------------------------------------------------------------------------
export const books = createModel<IBooksSchema, IBooksModel>(
  "books",
  booksSchema
);

export default books;
