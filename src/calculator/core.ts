import { CreateTaskSchema } from "@/app/_lib/validations";

export async function calcultePrice(task: CreateTaskSchema) {
    return Math.max(
        task.volume ? task.volume * 2 : 0, 
        task.weight ? task.weight * 0.5 : 0
    );
}

export async function calculteVolume(task: CreateTaskSchema) {
    if (task.height && task.width && task.length) {
        task.volume = task.height * task.width * task.length
    }else{
        task.volume = 0
    }
    return task.volume
}