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
import { LogOut } from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import BoardName from '@/pages/board/[boardName]';

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    // boxShadow: 24,
    borderRadius: 4,
    p: 4,
};

export default function Sidebar() {
    const [analyticsOn, setAnalyticsOn] = useRecoilState(analytics);
    const [boardData, setBoardData] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [boardId, setBoardId] = useState()
    const [memberName, setMemberName] = useState()

    useEffect(() => {
        fetchBoards()
    }, [])

    const fetchBoards = async () => {
        const response: any = await fetch("http://localhost:3000/api/routes/board/fetch");
        const allBoards = await response.json();
        setBoardId(allBoards.boards[0].boardName);
        setBoardData(allBoards.boards[0].members);
    }

    const addMemeber = async () => {
        const body = {
            memberEmail: memberName,
            boardName: boardId
        }
        const response: any = await fetch("http://localhost:3000/api/routes/member", {
            method: 'POST',
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            console.error("Error has occured")
        }
        await fetchBoards()
        handleClose();
    }
    function getEmailInitials(email: String) {
        const parts = email.split('@');
        const username = parts[0];
        const initials = username.split('').filter(char => char !== '.' && char !== '_').map(char => char.toUpperCase()).join('');
        return initials.substring(0, 2);
    }

    const router = useRouter()
    return (
        <div className="w-2/12 flex flex-col border pl-4 " style={{ height: '92vh' }}>
            <div className="flex p-2 justify-left mt-6">
                <SquareDashedKanban size={20} color="#39b4fc" className='mr-4' />Template
            </div>
            <div className="flex p-2 justify-left">
                <Home size={20} color="#39b4fc" className='mr-4 text-sm' />Home
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
            <hr></hr>
            <div className="flex p-2 justify-left mt-3">
                <Users size={20} color="#39b4fc" className='mr-4 text-sm' />Members <Plus size={23} className="ml-12 cursor-pointer mt-1" color='#42a5f5' onClick={handleOpen} />
            </div>
            <div className='mt-2 mx-auto'>
                {boardData.length > 0 ? boardData.map((item: any, index: any) => {
                    const intials = getEmailInitials(item);
                    return (<div key={index} className='flex mx-auto mt-2'>
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-400 text-white text-xs font-base mr-2 ">
                            {intials}
                        </div>
                        <div className='font-sans mt-2 text-sm antialiased ' key={index}>{item}</div>
                    </div>)
                }) : null}
            </div>
            <div className="flex p-2 justify-left mt-auto mb-4 cursor-pointer" onClick={async () => {
                await signOut({ redirect: false, callbackUrl: "/" });
                router.push('/');
            }}>
                <hr></hr>
                <LogOut size={20} color="#42a5f5" className='mr-4' />Sign Out
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className='w-full'>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Email"
                            multiline
                            maxRows={4}
                            className='w-full '
                            size="small"
                            value={memberName}
                            onChange={(event: any) => setMemberName(event.target.value)}
                        />
                        <div className='flex  justify-center items-center mt-8 '>
                            <Button variant="outlined" size='small' className='mr-3' onClick={handleClose}>Cancel</Button>
                            <Button variant="outlined" size='small' onClick={() => addMemeber()}>Add</Button>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}