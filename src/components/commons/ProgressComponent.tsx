import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function ProgressComponent({ size, sizeText, value, label }: { size: number, sizeText: number, value: number, label: string }) {
  return (
    <Box 
      className="w-fit h-fit"
      sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate" 
        value={value}
        size={size} // Tamaño del círculo
        thickness={4} // Grosor de la línea,
        sx={{
            color: 'primary.main', // progreso
            '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
            },
            // ESTE es el faltante (track)
            '& .MuiCircularProgress-track': {
            stroke: 'oklch(94% 0.018 250)', // tu #ebeff8 convertido
            },
        }}
      />
      <Box
        sx={{
          top: 0, left: 0, bottom: 0, right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
            sx={{
                fontSize: sizeText
            }}
            className="text-black! font-bold! dark:text-slate-200!"
            variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
        <Typography
            sx={{
                fontSize: 12
            }}
            className="text-black! font-bold! dark:text-slate-200!"
            variant="caption" component="div" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
}