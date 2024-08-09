import { RoleEnum } from "@/db/schema";
import { Payer, Recipient, Role, Sender } from "@/types/core";
import { faker } from "@faker-js/faker";

export function generateRandomPayer() : Payer {
    return {
        id: faker.random.alphaNumeric(10),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: "7777777777",
        address: faker.address.streetAddress(),
        role: Role.USER,
        bin: faker.random.alphaNumeric(10),
        abte_id: faker.random.alphaNumeric(10),
        password: faker.internet.password(),
    }
}

export function generateRandomRecipient() : Recipient {
    return {
        id: faker.random.alphaNumeric(10),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: "7777777777",
        address: faker.address.streetAddress(),
        role: Role.USER,
        password: faker.internet.password(),
    }
} 

export function generateRandomSender() : Sender {
    return {
        id: faker.random.alphaNumeric(10),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: "7777777777",
        address: faker.address.streetAddress(),
        role: Role.USER,
        password: faker.internet.password(),
    }
}