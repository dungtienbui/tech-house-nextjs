export function wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function toArray(value: string | string[] | null | undefined): string[] {
    if (!value) return []; // null hoặc undefined -> mảng rỗng
    return Array.isArray(value) ? value : [value];
}