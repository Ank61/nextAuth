import { LayoutDashboard } from 'lucide-react';
import { SquareDashedKanban } from 'lucide-react';
import { Home } from 'lucide-react';
import { Users } from 'lucide-react';
import { Settings } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="w-2/12 flex flex-col border pl-4 " style={{height : '92vh'}}>
            <div className="flex p-2 justify-left mt-4">
                <LayoutDashboard size={20} color="#39b4fc" className='mr-4'/>Boards
            </div>
            <div className="flex p-2 justify-left">
                <SquareDashedKanban size={20} color="#39b4fc" className='mr-4'/>Template
            </div>
            <div className="flex p-2 justify-left">
                <Home  size={20} color="#39b4fc" className='mr-4 text-sm'/>Home
            </div>
            <div className="flex p-2 justify-left">
                <Users size={20} color="#39b4fc" className='mr-4 text-sm'/>Members
            </div>
            <div className="flex p-2 justify-left">
                <Settings size={20} color="#39b4fc" className='mr-4 text-sm' />Settings
            </div>
        </div>
    )
}