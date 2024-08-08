// create post request that will create me a task using edge runtime

import { createTask } from "@/app/_lib/actions"
import { CreateTaskSchema } from "@/app/_lib/validations"
import { calcultePrice, calculteVolume } from "@/calculator/core";
import { he } from "@faker-js/faker";

export async function POST(request: Request) {
    console.log(request)

    // get string title from request body json object
    const { description, height, width, length, weight } = await request.json() as { description: string, height: number, width: number, length: number, weight: number };
    console.log(description)
    // check if all params are present
    if (!description) {
        return new Response(JSON.stringify({
            error: 'All params are required'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const task: CreateTaskSchema = {
        description,
        label: 'feature',
        status: 'todo',
        priority: 'high',
        height: height,
        width: width,
        length: length,
        weight: weight,
        
    }

    const response = await createTask(task) as { code: string | null, error: string | null };

    if (response.code === null) {
        return new Response(JSON.stringify({
            error: 'Task creation failed'
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    return new Response(JSON.stringify(task), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

