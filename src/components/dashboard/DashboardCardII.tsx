import { CircularProgress, Typography } from "@mui/material"
import { Box } from "@mui/system"

interface DashboardCardProps {
    title: string
    value: number
}

export default function DashboardCardII({ title, value }: DashboardCardProps) {
    return (
        <div className="flex-1 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200 shadow-md dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/20 transition-all duration-300 group">
          
                <div className="ml-6">
                   <CircularWithValueLabel value={value} />
                </div>
                <div className={"text-black font-semibold dark:text-slate-200"}>
                    {title}
                </div>
        </div>
    )
}

function CircularWithValueLabel({ value }: { value: number }) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress 
        variant="determinate" 
        value={value} 
        size={100} // Tamaño del círculo
        thickness={5} // Grosor de la línea
      />
      <Box
        sx={{
          top: 0, left: 0, bottom: 0, right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography 
            sx={{
                fontSize: 20
            }}
            className="text-black! font-bold! dark:text-slate-200!"
            variant="caption" component="div" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}