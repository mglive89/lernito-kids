import type { PicBank } from './helpers';
import { LANGUAGE_PICS } from './languages';
import { MATH_PICS } from './math';
import { SCIENCE_PICS } from './science';
import { SOCIETY_PICS } from './society';
import { TECH_PICS } from './tech';

/** Alle Bildaufgaben, nach Modul-ID */
export const PICTURE_TASKS: PicBank = { ...LANGUAGE_PICS, ...MATH_PICS, ...SCIENCE_PICS, ...SOCIETY_PICS, ...TECH_PICS };
