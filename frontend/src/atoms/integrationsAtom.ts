import { atom } from "jotai";

export type IntegrationsState = Record<string, boolean>;

export const integrationsAtom = atom<IntegrationsState>({});
