const MAX_SOURCE_SIZE = 8 * 1024 * 1024;
const MAX_UPLOAD_SIZE = 2 * 1024 * 1024;
const MAX_WIDTH = 2048;
const MAX_HEIGHT = 1024;
const QUALITY_LEVELS = [0.9, 0.82, 0.74, 0.66, 0.58];

export interface PreparedLogo {
  file: File;
  width: number;
  height: number;
}

function canvasToWebp(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("No se pudo procesar la imagen en este navegador."));
    }, "image/webp", quality);
  });
}

export async function prepareLogoFile(file: File): Promise<PreparedLogo> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("Formato no admitido. Usa PNG, JPEG o WebP.");
  }
  if (file.size > MAX_SOURCE_SIZE) {
    throw new Error("El archivo original no puede superar 8 MB.");
  }
  if (typeof createImageBitmap !== "function") {
    throw new Error("Este navegador no permite procesar la imagen. Prueba con otro navegador.");
  }

  let image: ImageBitmap;
  try {
    image = await createImageBitmap(file);
  } catch {
    throw new Error("No se pudo abrir la imagen seleccionada.");
  }

  try {
    let scale = Math.min(1, MAX_WIDTH / image.width, MAX_HEIGHT / image.height);

    while (scale >= 0.2) {
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("No se pudo procesar la imagen seleccionada.");

      context.drawImage(image, 0, 0, width, height);
      for (const quality of QUALITY_LEVELS) {
        const blob = await canvasToWebp(canvas, quality);
        if (blob.size <= MAX_UPLOAD_SIZE) {
          if (blob.type !== "image/webp") {
            throw new Error("Este navegador no pudo convertir el logo a WebP.");
          }
          const baseName = file.name.replace(/\.[^.]+$/, "") || "company-logo";
          return {
            file: new File([blob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() }),
            width,
            height,
          };
        }
      }

      scale *= 0.8;
    }
  } finally {
    image.close();
  }

  throw new Error("No fue posible optimizar el logo por debajo de 2 MB.");
}
