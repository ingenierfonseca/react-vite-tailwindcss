export function pluralize(word: string): string {
    const normalized = word.trim();

    if (!normalized) return normalized;

    // Palabras terminadas en vocal
    if (/[aeiouáéó]$/i.test(normalized)) {
        return `${normalized}s`;
    }

    // Palabras terminadas en consonante
    if (/[íú]$/i.test(normalized)) {
        return `${normalized}es`;
    }

    // Palabras terminadas en z
    if (/z$/i.test(normalized)) {
        return `${normalized.slice(0, -1)}ces`;
    }

    // Palabras terminadas en otras consonantes
    return `${normalized}es`;
}