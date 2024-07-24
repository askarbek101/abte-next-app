import { NeonQueryFunction, neon } from "@neondatabase/serverless";
import { env } from "process";

export class PostgresService {
    private static instance: PostgresService;
    private client: NeonQueryFunction<false, false>;
  
    private constructor() {
        console.log('Postgres service initialized');
        if (env.POSTGRES_DATABASE_URL){
            this.client = neon(env.POSTGRES_DATABASE_URL);
        }else{
            throw new Error('POSTGRES_DATABASE_URL not found in environment variables');
        }
    }
  
    public static getInstance(): PostgresService {
      if (!PostgresService.instance) {
        PostgresService.instance = new PostgresService();
      }
      return PostgresService.instance;
    }

    public async getCities(): Promise<Record<string, any>[]> {
        const response = await this.client`SELECT * from cities`;
        return response;
    }
}