'use client';
// Pencil.jsx
import { wrapEffect } from "@react-three/postprocessing";
import { PencilEffect } from "./PencilEffect";

export const Pencil = wrapEffect(PencilEffect);
