import { useEffect, useMemo } from "react";

export const useClientImagePreview = (file: File | null) => {
    const previewUrl = useMemo(
        () => file ? URL.createObjectURL(file) : null,
        [file],
    );

    useEffect(() => () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    return {
        previewUrl
    };
};

/*import { useEffect, useState } from "react";

export const useClientImagePreview = (
    file: File | null
) => {

    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);

    useEffect(() => {

        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(file);

        setPreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };

    }, [file]);

    return {
        previewUrl
    };
};*/