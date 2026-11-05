export type Gender = "masculine" | "feminine";

export function genderWord(
    word: string,
    gender: Gender
): string {
    return gender === "feminine" ? `${word}as` : `${word}os`;
}