import { Pool, QueryResultRow } from 'pg'

const globalForPg = global as unknown as { pool?: Pool };

export const pool =
    globalForPg.pool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
            process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
    });

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;

export async function query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: any[]
): Promise<T[]> {
    const result = await pool.query<T>(text, params);
    return result.rows;
}
