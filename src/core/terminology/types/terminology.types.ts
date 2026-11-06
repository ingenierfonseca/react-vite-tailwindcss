export type Gender = "masculine" | "feminine";

export interface TerminologyItem {
    key: string;
    isMale: boolean;
}

export interface TerminologyLabel {
    key: string;
    singular: string;
    plural: string;
    isMale: boolean;
}

export interface TerminologyResponse {
    version: number;
    locale: string;
    terminologyLabels: TerminologyLabel[];
}

export interface TerminologyContextType {
    terminology: Record<string, TerminologyLabel>;
    locale: string;
    isLoading: boolean;

    getLabel: (key: string, plural?: boolean) => string;
    getGender: (key: string) => Gender;

    /*t: (
        key: string,
        params?: Record<string, string | number>
    ) => string;*/

    refresh: () => Promise<void>;
}