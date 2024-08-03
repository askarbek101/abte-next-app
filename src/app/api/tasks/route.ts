// create post request that will create me a task using edge runtime

import { createTask } from "@/app/_lib/actions"
import { CreateTaskSchema } from "@/app/_lib/validations"

export async function POST(request: Request) {
    console.log(request)

    // get string title from request body json object
    const { title } = await request.json() as { title: string };

    // check if all params are present
    if (!title) {
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
        title,
        label: 'feature',
        status: 'todo',
        priority: 'high'
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

