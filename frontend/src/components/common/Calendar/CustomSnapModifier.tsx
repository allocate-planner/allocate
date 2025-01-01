import type { Modifier } from "@dnd-kit/core";

export function createSnapModifier(gridSize: number): Modifier {
  return ({ transform }) => ({
    ...transform,
    x: Math.ceil(transform.x / 0) * 0,
    y: Math.ceil(transform.y / gridSize) * gridSize,
  });
}
