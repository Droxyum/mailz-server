export const hasMaxLengthOf = (content: string, num: number) =>
    num > (content || '').length;

export const hasMinLengthOf = (content: string, num: number) =>
    num < (content || '').length;

export const containsKeywork = (content: string, work: string) =>
    new RegExp(work, 'ig').test(content);
