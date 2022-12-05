import { Document } from 'mongoose';

export type CollActionDocument<T> = T & Document;
