export function isEnumValue<T extends Record<string, string | number>>(
    enumObj: T,
    value: any
): value is T[keyof T] {
    console.log("Object.values(enumObj): ", Object.values(enumObj))
    return Object.values(enumObj).includes(value);
}
