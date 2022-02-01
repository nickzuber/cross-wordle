import { words as extraWords } from "./extra-words";
import { words as goodWords } from "./good-words";

export const words = new Set(Array.from(goodWords).concat(Array.from(extraWords)));
