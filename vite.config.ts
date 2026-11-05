import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";

const httpsCertificateDirectory = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, "ASP.NET", "https")
  : path.join(homedir(), ".aspnet", "https");
const httpsCertificatePath = process.env.VITE_DEV_CERT
  ?? path.join(httpsCertificateDirectory, "react-vite-tailwindcss.pem");
const httpsKeyPath = process.env.VITE_DEV_KEY
  ?? path.join(httpsCertificateDirectory, "react-vite-tailwindcss.key");

if (!existsSync(httpsCertificatePath) || !existsSync(httpsKeyPath)) {
  throw new Error(
    "No se encontró el certificado HTTPS local. Ejecuta `npm run https:setup` y vuelve a iniciar Vite.",
  );
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    https: {
      cert: readFileSync(httpsCertificatePath),
      key: readFileSync(httpsKeyPath),
    },
    proxy: {
      "/tiles": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/tiles/, "/data/nicaragua"),
      },
    },
  },

  /* shadcn@latest */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
