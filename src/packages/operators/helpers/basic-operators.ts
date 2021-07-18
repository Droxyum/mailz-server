export const and = (...els: boolean[]) => els.reduce((a, b) => a && b, true);

export const or = (...els: boolean[]) => els.reduce((a, b) => a || b, true);
