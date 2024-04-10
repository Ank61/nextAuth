import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { Plus } from 'lucide-react';
import { useRecoilState } from "recoil";
import { analytics } from "@/global/boardAnalytics";
import { motion, sync, useCycle } from "framer-motion";
import { duration } from "@mui/material";
import IconButton from '@mui/material/IconButton';
//import Tooltip from '@mui/material/Tooltip';

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';


interface CommitLogs {
    time: String,
    fromCard: String,
    toCard: String,
    title: String,
    color: String
}


const generateRandomColor = () => {
    const randomRed = Math.floor(Math.random() * 256);
    const randomGreen = Math.floor(Math.random() * 256);
    const randomBlue = Math.floor(Math.random() * 256);
    return `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`;
};

const LightTooltip = styled(({ className, ...props }: any) => (
    <Tooltip
        {...props}
        classes={{ popper: className }}
        className="cursor-pointer"
        slotProps={{
            popper: {
                sx: {
                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                    {
                        marginTop: '0px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                    {
                        marginBottom: '0px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                    {
                        marginLeft: '30px',
                    },
                    [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                    {
                        marginRight: '0px',
                    },
                },
            },
        }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
    },
}));

export default function BoardName() {
    const [commitLogs, setCommitLogs] = useState<CommitLogs[]>([]);
    const [commitColor, setCommitColor] = useState("")
    const [cards, setCards] = useState([{
        cardName: "Stuff to Try (this is a list)",
        items: [{ title: "Swipe left or right to see other lists on this board." }],
    }, {
        cardName: "Try it ( Another Board )",
        items: [{ title: "Done with this board? Tap Archive board in the board settings menu to close it." }, { title: "Tap and hold a card to pick it up and move it. Try it now!" }, { title: "Create as many cards as you want, we've got an unlimited supply!" }, { title: "Tap this card to open it and see more details." }, { title: "Start using Trello!" }],
    }]);
    const [selectedLog, setSelectedLog] = useState<any>()
    const [analyticsOn, setAnalyticsOn] = useRecoilState(analytics);
    const [picked, setPicked] = useState<any>({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedTitle, setSelectedTitle] = useState<any>();

    let rIndex: number;

    const handleDropped = (recievedElements: any, index: any) => {
        cards.map(item => {
            if (item.cardName === picked) {
                //Delete the element
                item.items.splice(selectedIndex, 1);
            }
            if (item.cardName === recievedElements.cardName) {
                item.items.splice(rIndex, 0, selectedTitle);
                rIndex = 0;
            }
        });
        const color = generateRandomColor();
        setCommitColor(color);
        const currentTime = new Date().getMinutes()
        const log: CommitLogs = {
            time: JSON.stringify(currentTime),
            fromCard: picked,
            toCard: recievedElements.cardName,
            title: selectedTitle,
            color: color,
        }
        console.log(log)
        setCommitLogs((prev) => [...prev, log])
        setCards([...cards]);
    }

    const handleDragStart = (element: any, index: any, ele: any) => {
        setPicked(element);
        setSelectedIndex(index);
        setSelectedTitle(ele);
    }

    const allowDrag = (event: any) => {
        event.preventDefault();
    }
    const variants = {
        open: {
            height: "100%",
            transition: {
                type: "spring",
                // stiffness: 500,
                // damping: 30,
                duration: 1
            }
        },
        closed: {
            height: "1/6",
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30
            }
        }
    };


    const handleCommit = (element: any) => {
        setSelectedLog(element)
        console.log(element)
    }

    return (
        <div> <Header />
            <div className="flex flex-row w-full" >
                <Sidebar />
                <div className="w-full min-h-screen" style={{ backgroundColor: '#a5deff' }}>
                    <div className="grid grid-cols-5 gap-4 pt-4 pl-7 ">
                        {cards?.map((elements: any, index: any) =>
                            <>
                                <div id={elements.cardName} key={index} onDrop={() => handleDropped(elements, index)} onDragOver={(event) => allowDrag(event)} className="flex justify-center items-center flex-col w-5/6 h-fit bg-white rounded-lg">
                                    <p className="font-sans text-sm font-medium mt-2 mb-5">{elements.cardName}</p>
                                    {elements.items.map((ele: any, indexKey: any) =>
                                        <div draggable onDragStart={() => handleDragStart(elements.cardName, indexKey, ele)} key={indexKey} onDrop={() => { rIndex = indexKey }} className="flex justify-center cursor-pointer  items-center w-11/12 h-auto mb-2 bg-sky-200/100 rounded-lg mt-2 font-sans text-sm font-normal break-words pl-4 pr-4 pt-2 pb-2">{ele.title}</div>)}
                                    <div className="flex justify-start w-11/12 font-sans text-sm font-medium m-3">
                                        <Plus size={19} className="mr-3" /> Add a Card
                                    </div>
                                </div>
                            </>)}
                        <div className="flex justify-center items-center w-fit h-fit font-sans text-sm pl-8  pr-8 pt-2 pb-2 font-medium text-white rounded-lg" style={{ backgroundColor: '#00a1ff' }}>
                            <Plus size={19} className="mr-3" />   Add Another List
                        </div>
                        {analyticsOn ? <motion.div
                            className="relative flex items-center overflow-auto flex-col w-full h-fit bg-white  rounded-lg"
                            animate={analyticsOn ? "open" : "closed"}
                            variants={variants}
                        // id="style-6"
                        >
                            <div className="font-sans font-sans font-medium" style={{ backgroundColor: '#ffffff' }}>Board Logs</div>
                            <div className="mt-4 force-overflow pb-10">
                                {commitLogs?.map((item: any, index: number) =>
                                    <div key={index} >
                                        <div className="z-0 ml-1.5 border w-0 h-10 border-slate-300"></div>
                                        <LightTooltip title=
                                            {
                                                <div>
                                                    <Typography className="font-sans font-sans text-sm" style={{ backgroundColor: '#ffffff' }}><span className="font-medium mr-2">From Card:</span> {item.fromCard} </Typography>
                                                    <Typography className="font-sans font-sans text-sm" style={{ backgroundColor: '#ffffff' }}><span className="font-medium mr-2">To Card:</span>  {item.toCard}</Typography>
                                                    <Typography className="font-sans font-sans text-sm" style={{ backgroundColor: '#ffffff' }}>
                                                        <span className="font-medium mr-2">Title:</span>  {item.title.title}</Typography>
                                                </div>
                                            }
                                            className="cursor-pointer" placement="right" arrow>
                                            <div style={selectedLog !== index ? {} : { border: '1px solid #00a1ff', borderRadius: 10, padding: 2 }}>
                                                <div onClick={() => handleCommit(index)} key={index} className={`z-10 w-4 h-4 rounded-full`}
                                                    style={{ backgroundColor: item.color }}>
                                                </div>
                                            </div>
                                        </LightTooltip>
                                    </div>)}
                            </div>
                        </motion.div> : null}
                    </div>
                </div>
            </div>
        </div >
    )
}