import { CreateTaskSchema } from "@/app/_lib/validations";

export async function calculatePrice(volume: number, weight: number) {
    return Math.max(
        volume ? volume * 2 : 0, 
        weight ? weight * 0.5 : 0
    );
}

export async function calculateVolume(height: number, width: number, length: number) {
    let volume: number = 0
    if (height && width && length) {
        volume = height * width * length
    }
    return volume
}