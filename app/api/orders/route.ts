import { NextRequest } from "next/server"
import { PostgresService } from "@/services/postgres-service";
export const runtime = 'edge'

export async function GET(request: NextRequest) {
    var postgres = PostgresService.getInstance();

    var data = await postgres.getVersion() as {version: string}[];

    if (data.length === 0) {
        return new Response('No data found');
    }

    const version: string = data ? data[0].version : 'No version found';

    return new Response(version);
}