import StatsGrid from "../components/dashboard/StatsGrid";
import WeekAppoiment from "../components/dashboard/WeekAppoiment";

const weekAppoiments = [
    {
        name: 'Dra. Melissa Fonseca', 
        specialty: 'Ortodoncia . Especialista Certificada',
        avatar: 'https://scontent-bog2-2.xx.fbcdn.net/v/t1.6435-9/33609023_2027018804036941_7487435140159766528_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=7b2446&_nc_ohc=bDZQ6_PDGB8Q7kNvwE9fEBk&_nc_oc=AdrI8hhK6K2UOT3zLs0po_jHfPAqfygoQXSQ8Q_bUKty4DL3aQQE58L9DGafxiYOMcI&_nc_zt=23&_nc_ht=scontent-bog2-2.xx&_nc_gid=_rZVziTmO-hXzIimVGW1YA&_nc_ss=7a30f&oh=00_Afwsvzfzvcl9BCl8410F4KOvlpgYW8HDzolNYo8EUpmr5g&oe=69E41FF1',
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
                current: true,
                count: 0,
                appoiments: [
                    { time: '09:00AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30AM', patient: 'Jane Smith', status: 'pending' },
                    { time: '11:30AM', patient: '', status: 'free' },
                    { time: '12:30AM', patient: '', status: 'free' },
                    { time: '10:00PM', patient: 'Thiago Fonseca', status: 'confirmed' },
                    { time: '11:00PM', patient: '', status: 'canceled' },
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
                date: '28',
                appoiments: [
                    { time: '09:00 AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30 AM', patient: 'Jane Smith', status: 'pending' },
                ]
            },
            {
                day: 'Tuesday',
                date: '29',
                count: 0,
                appoiments: []
            },
            {
                day: 'Wednesday',
                date: '30',
                count: 0,
                appoiments: []
            },
            {
                day: 'Thursday',
                date: '31',
                current: true,
                count: 0,
                appoiments: []
            },
            {
                day: 'Friday',
                date: '01',
                count: 0,
                appoiments: [
                    { time: '09:00 AM', patient: 'John Doe', status: 'confirmed' },
                    { time: '10:30 AM', patient: 'Jane Smith', status: 'pending' }
                ]
            },
            {
                day: 'Saturday',
                date: '02',
                count: 0,
                appoiments: []
            },

        ]
    },
]
export default function DashboardPage() {
  return (
    <div>
      <StatsGrid />
      <div className="flex flex-wrap gap-4">
        {weekAppoiments.map((item, index) => (
            <WeekAppoiment key={index} appointment={item} />
        ))}
      </div>
    </div>
  );
}