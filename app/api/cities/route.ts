import { NextRequest } from "next/server"
import { PostgresService } from "@/services/postgres-service";
import { City } from "@/types/city";
export const runtime = 'edge'

export async function GET(request: NextRequest) {
    var postgres = PostgresService.getInstance();

    const data: City[] = await postgres.getCities() as City[];

    if (data.length === 0) {
        return new Response('No city found');
    }

    return new Response(JSON.stringify(data));
}