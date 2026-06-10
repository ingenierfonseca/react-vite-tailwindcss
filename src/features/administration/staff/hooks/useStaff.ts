import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import type { Staff } from "@/models/staff.type";
import { StaffService } from "@/services/staff/staff.service";
import { staffSchema, type StaffFormValues } from "../schemas/staff.schema";

export function useStaff(initialData?: Staff) {
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
        const [selectedImage, setSelectedImage] = useState<File | null>(null);
    
        const handleUploadClick = () => {
            fileInputRef.current?.click();
        };
    
        const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                setSelectedImage(file);
            }
        };

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            id: 0,
            firstName: "",
            lastName: "",
            gender: "",
            email: "",
            phone: "",
            address: "",
            avatar: "",
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const save = async (): Promise<boolean> => {
        const values = form.getValues();
        const result = staffSchema.safeParse(values);
        if (!result.success) {
            //result.error.errors.forEach((err) => toast.error(err.message));
            return false;
        }

        setLoading(true);
        try {
            if (values.id) {
                await StaffService.put(values.id, values as Staff);
                toast.success("Staff actualizado correctamente");
            } else {
                await StaffService.post(values as Staff);
                toast.success("Staff creado correctamente");
            }
            return true;
        } catch (err: any) {
            const msg = err.response?.data?.message || "Error al guardar el staff";
            toast.error(msg);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { ...form, loading, save, selectedImage, fileInputRef, handleFileChange, handleUploadClick };
}
