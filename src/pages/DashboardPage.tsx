import StatsGrid from "../components/dashboard/StatsGrid";
import WeekAppoiment from "../components/dashboard/WeekAppoiment";

const weekAppoiments = [
    {
        name: 'Dra. Melissa Fonseca', 
        specialty: 'ortodoncia',
        avatar: 'https://avatars.githubusercontent.com/u/16735800?v=4',
        days: [
            { 
                day: 'Monday',
                date: '28',
                count: 5,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' },
                ]
            },
            {
                day: 'Tuesday',
                date: '29',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Wednesday',
                date: '30',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Thursday',
                date: '31',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Friday',
                date: '01',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Saturday',
                date: '02',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Sunday',
                date: '03',
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' }
                ]
            }
        ]
    },
    {
        name: 'Dr. Marlon Fonseca', 
        specialty: 'odontologia general',
        avatar: 'https://avatars.githubusercontent.com/u/16735800?v=4',
        days: [
            { 
                day: 'Monday', 
                count: 5,
                appoiments: [
                    { time: '09:00 AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30 AM', patient: 'Jane Smith', status: 'pending' },
                ]
            },
        ]
    },
]
export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <StatsGrid />
      <div className="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4">
        {weekAppoiments.map((item, index) => (
            <WeekAppoiment key={index} appointment={item} />
        ))}
      </div>
    </div>
  );
}