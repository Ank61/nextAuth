import { LayoutDashboard } from 'lucide-react';
import { SquareDashedKanban } from 'lucide-react';
import { Home } from 'lucide-react';
import { Users } from 'lucide-react';
import { Settings } from 'lucide-react';
import { useRecoilState } from 'recoil';
import { analytics } from '@/global/boardAnalytics';
import { Switch } from '@mui/material';
import { styled } from '@mui/material/styles';
import { blue, pink } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';

const PinkSwitch = styled(Switch)(({ theme }) => ({
    width: 54,
    height: 36,
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: blue[400],
        '&:hover': {
            backgroundColor: alpha(blue[200], theme.palette.action.hoverOpacity),
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: blue[200],
    },
    '& .MuiSwitch-thumb': {
        width: 18,
        height: 18,
    }
}));

export default function Sidebar() {
    const [analyticsOn, setAnalyticsOn] = useRecoilState(analytics);
    return (
        <div className="w-2/12 flex flex-col border pl-4 " style={{ height: '92vh' }}>
            <div className="flex p-2 justify-left mt-6">
                <SquareDashedKanban size={20} color="#39b4fc" className='mr-4' />Template
            </div>
            <div className="flex p-2 justify-left">
                <Home size={20} color="#39b4fc" className='mr-4 text-sm' />Home
            </div>
            <div className="flex p-2 justify-left">
                <Users size={20} color="#39b4fc" className='mr-4 text-sm' />Members
            </div>
            <div className="flex p-2 justify-left mb-2">
                <Settings size={20} color="#39b4fc" className='mr-4 text-sm' />Settings
            </div>
            <hr></hr>
            <div className="flex p-2 justify-left mt-3">
                <LayoutDashboard size={20} color="#39b4fc" className='mr-4' />Boards
            </div>
            <div className="flex p-2 justify-center text-sm font-sans mt-1">
                <div className='font-medium	 pt-2'>Board Analytics</div> <PinkSwitch className="ml-4" checked={analyticsOn} onChange={() => setAnalyticsOn(!analyticsOn)} />
            </div>
        </div>
    )
}