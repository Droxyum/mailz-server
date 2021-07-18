export const isOneOf = (list: string[], el: string) =>
    (list || []).some((l) => l === el);

export const isManyOf = (list: string[], el: string) =>
    (list || []).filter((l) => l === el).length > 1;

export const isAllOf = (list: string[], el: string) =>
    (list || []).filter((l) => l === el).length === (list || []).length;
