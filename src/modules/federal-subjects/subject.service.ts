import prisma from "../../utils/prisma";
import { FederalSubject, FederalSubjects } from "./subject.schema";
import { FEDERAL_SUBJECTS_CODES_AND_TZ } from "./data";


export async function getFederalSubjectByName(federalSubjectName: string) {
    return await prisma.federalSubject.findUnique({
        where:  {
            name: federalSubjectName
        },
    })
}
export async function getAllFederalSubjects() {
    return await prisma.federalSubject.findMany({
        take: 100,
        orderBy:  {
            code: 'asc'
        }
    })
}


export async function createFederalSubject(federalSubject: FederalSubject) {
    return await prisma.federalSubject.upsert({
        where: {
            name: federalSubject.name
        },
        update: federalSubject,
        create: federalSubject,
    })
}


export async function seedFederalSubjects(federalSubjects: FederalSubjects) {
    for (const federalSubject of federalSubjects) {
        await createFederalSubject(federalSubject)
    }
}

seedFederalSubjects(FEDERAL_SUBJECTS_CODES_AND_TZ)