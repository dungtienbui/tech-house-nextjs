import bcrypt from "bcryptjs";

export async function saltAndHashPassword(password: string): Promise<string> {
    // Số vòng lặp salt, 12 là một giá trị an toàn và phổ biến.
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}