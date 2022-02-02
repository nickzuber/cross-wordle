import { words as Two } from "./two";
import { words as Three } from "./three";
import { words as Four } from "./four";
import { words as Five } from "./five";
import { words as Six } from "./six";

export const words = new Set(Two.concat(Three).concat(Four).concat(Five).concat(Six));
