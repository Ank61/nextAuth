import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { Plus } from 'lucide-react';
import { useRecoilState } from "recoil";
import { analytics } from "@/global/boardAnalytics";
import { motion, sync, useCycle } from "framer-motion";
import { ListItem, duration } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { addDays, format, getTime } from 'date-fns';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import cuid from 'cuid';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Trash } from 'lucide-react';
import { BookCheck } from 'lucide-react';



interface CommitLogs {
    commitId: String,
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

function a11yProps(index: any) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CustomTabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            className="p-0"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export default function BoardName() {
    const [commitLogs, setCommitLogs] = useState<CommitLogs[]>([]);
    const [commitColor, setCommitColor] = useState("")
    const [cards, setCards] = useState<any[]>([]);
    const [selectedLog, setSelectedLog] = useState<any>([])
    const [analyticsOn, setAnalyticsOn] = useRecoilState(analytics);
    const [picked, setPicked] = useState<any>({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedTitle, setSelectedTitle] = useState<any>();
    const [commitLogIndex, setCommitLogsIndex] = useState<any>();
    const [discardingCommit, setDiscardingLogs] = useState<String[]>([]);
    const [tabValue, setTabValue] = React.useState(0);
    const [boardKey, setBoardKey] = useState();
    const [logs , setLogs] = useState<any>([])

    useEffect(() => {
        fetchBoards()
    }, []);

    useEffect(()=>{
        fetchLogs()
    },[cards])

    const fetchBoards = async () => {
        const response: any = await fetch("http://localhost:3000/api/routes/board/fetch");
        const allBoards = await response.json();
        setCards(allBoards.boards[0].cards)
        setBoardKey(allBoards.boards[0]._id)
        const responses: any = await fetch("http://localhost:3000/api/routes/logs",{
            method : 'POST',
            body : JSON.stringify({boardId : allBoards.boards[0]._id})
        });
        const data = await responses.json();
        console.log(data)
    }

    const fetchLogs = async()=>{
        const body = {
            boardId : boardKey
        }
        const response: any = await fetch("http://localhost:3000/api/routes/logs",{
            method : 'POST',
            body : JSON.stringify(body)
        });
        const allBoards = await response.json();
        console.log(allBoards[0]?.history)
        setLogs(allBoards[0]?.history)
    }
    const handleChangeTab = (event: any, newValue: any) => {
        setTabValue(newValue);
    };
    let rIndex: number;

    const handleDropped = async (recievedElements: any, index: any) => {
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
        const currentTime = new Date()
        const modifiedTimestamp = format(currentTime, "HH:mm a");
        const log: CommitLogs = {
            commitId: cuid(),
            time: modifiedTimestamp,
            fromCard: picked,
            toCard: recievedElements.cardName,
            title: selectedTitle,
            color: color,
        }
        setCommitLogs((prev) => [...prev, log])
        setCards([...cards]);
        //Request to redis
        const bordInfo = {
            boardKey: boardKey,
            boardData: { data: cards, time: new Date() },
        }
        const response: any = await fetch("http://localhost:3000/api/routes/cache", {
            method: 'POST',
            body: JSON.stringify(bordInfo)
        });
        console.log("CAche Response", response);
        return
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

    const handleCommit = (element: any, item: any) => {
        const selectedIndex = commitLogs.findIndex(ele => ele.commitId === item.commitId)
        setCommitLogsIndex(selectedIndex)
        const selectedCommit = commitLogs.filter((ele, ind: any) => ind >= selectedIndex);
        setSelectedLog(selectedCommit);
        const commitIdArray: any = commitLogs.map((commits: CommitLogs, ind: any) => ind >= selectedIndex ? commits.commitId : null).filter(comm => comm !== null)
        setDiscardingLogs([...commitIdArray])
    }

    const deleteCommit = () => {
        const updatedCards = commitLogs.filter((itemCommit: any, index: any) => !discardingCommit.includes(itemCommit.commitId));
        setCommitLogs(updatedCards);
        const revertedCommits: any = cards.map((insertItem, indexItem) => {
            selectedLog.forEach((e: any, i: any) => {
                if (e.fromCard === insertItem.cardName) {
                    insertItem.items.push({ title: e.title.title });
                }
                if (e.toCard === insertItem.cardName) {
                    const indexfound: any = insertItem.items.findIndex((item: any) => item.title === e.title.title)
                    insertItem.items.splice(indexfound, 1);
                }
            });
            return insertItem;
        });
        // setCards([...revertedCommits])
        setDiscardingLogs([]);
    }

    const handleKeep = () => {
        setDiscardingLogs([]);
    }

    return (
        <div> <Header />
            <div className="flex flex-row w-full" >
                <Sidebar />
                <div className="w-full min-h-screen" style={{ backgroundColor: '#a5deff' }}>
                    <div className="grid gap-4 grid-cols-3 lg:grid-cols-5  pt-4 pl-7 ">
                        {cards?.map((elements: any, index: any) =>
                            <>
                                <div id="dropStarting" key={index} onDrop={() => handleDropped(elements, index)} onDragOver={(event) => allowDrag(event)} className="flex justify-center items-center flex-col w-5/6 h-fit bg-white rounded-lg">
                                    <p className="font-sans text-sm font-medium mt-2 mb-5">{elements.cardName}</p>
                                    {elements.items.map((ele: any, indexKey: any) =>
                                        <motion.div animate={{ y: 10 }}
                                            transition={{
                                                type: "spring", duration: 1, stiffness: 100,
                                                damping: 10
                                            }} id="dragStarting" draggable onDragStart={() => handleDragStart(elements.cardName, indexKey, ele)} key={indexKey} onDrop={() => { rIndex = indexKey }} className="flex justify-center cursor-pointer  items-center w-11/12 h-auto mb-2 bg-sky-200/100 rounded-lg mt-2 font-sans text-sm font-normal break-words pl-4 pr-4 pt-2 pb-2">{ele.title}</motion.div>)}
                                    <div className="flex justify-start w-11/12 font-sans text-sm font-medium m-3">
                                        <Plus size={19} className="mr-3" /> Add a Card
                                    </div>
                                </div>
                            </>)}
                        {/* <div className="flex justify-center items-center w-fit h-fit font-sans text-sm pl-8  pr-8 pt-2 pb-2 font-medium text-white rounded-lg" style={{ backgroundColor: '#00a1ff' }}>
                            <Plus size={19} className="mr-3" />   Add Another List
                        </div> */}
                        {analyticsOn ? <motion.div
                            className="relative flex items-center overflow-auto flex-col w-full h-fit bg-white  rounded-lg mx-auto"
                            animate={analyticsOn ? "open" : "closed"}
                            variants={variants}
                        // id="style-6"
                        >
                            <div className="font-sans font-sans font-medium mb-1 mt-2" style={{ backgroundColor: '#ffffff' }}>Board Logs</div>
                            {/* <Box sx={{ width: '100%', alignItems: 'center' }} >
                                <Box sx={{}}>
                                    <Tabs centered value={tabValue} onChange={handleChangeTab} style={{ fontFamily: 'sans-serif', fontWeight: 600 }}>
                                        <Tab sx={{ textTransform: "none", fontWeight: 500 }} style={{ fontWeight: 600, fontFamily: 'sans-serif', letterSpacing: 1 }} label="Activity Tracking" {...a11yProps(0)} className="text-xs font-medium" />
                                        <Tab sx={{ textTransform: "none" }} label="Card Metrics" style={{ fontWeight: 600, fontFamily: 'sans-serif', letterSpacing: 1 }} {...a11yProps(1)} className="text-xs font-medium" />
                                    </Tabs>
                                </Box>
                                <CustomTabPanel value={tabValue} index={0}  >
                                    <div className="relative flex items-center overflow-auto flex-col w-full h-fit bg-white  rounded-lg">
                                        {discardingCommit.length > 0 ? <motion.div animate={{ y: 6 }} className="flex  mb-4" transition={{ type: "spring", duration: 1 }}>
                                            <motion.div onClick={() => handleKeep()} whileHover={{ scale: 1.1 }} className="rounded-lg text-xs flex cursor-pointer mr-10"><BookCheck color="#00a1ff" size={18} className="mr-2" /> <span className="pt-0.5">Keep</span> </motion.div>
                                            <motion.div onClick={() => deleteCommit()} whileHover={{ scale: 1.1 }} className="text-xs flex cursor-pointer "><Trash color="#ef0b60" size={18} className="mr-2" /> <span className="pt-0.5">Remove</span> </motion.div>
                                        </motion.div> : <div className=" mb-4"></div>}
                                        <div className="flex flex-cols">
                                            <div className="mt-4 force-overflow pb-10">
                                                {commitLogs?.slice().reverse().map((item: any, index: number) =>
                                                    <motion.div
                                                        key={index}
                                                        // style={discardingCommit.includes(item.commitId) ? { backgroundColor: '#ffd3df' } : {}}
                                                        animate={{ y: 6 }}
                                                        transition={{ type: "spring" }}
                                                    >
                                                        <LightTooltip title=
                                                            {<div>
                                                                <Typography className="font-sans text-sm" style={{ backgroundColor: '#ffffff', color: 'black' }}><span className="text-sm font-sans font-semibold mr-2" style={{ color: `${item.color}` }}>From Card:</span> {item.fromCard} </Typography>
                                                                <Typography className="font-sans font-sans text-sm" style={{ backgroundColor: '#ffffff' }}><span className="text-sm font-semibold  mr-2 font-sans" style={{ color: `${item.color}` }}>To Card:</span>  {item.toCard}</Typography>
                                                                <Typography className="font-sans font-sans text-sm" style={{ backgroundColor: '#ffffff' }}>
                                                                    <span style={{ color: `${item.color}` }} className=" font-sans font-semibold mr-2 text-sm">Title:</span>  {item.title.title}</Typography>
                                                            </div>}
                                                            className="cursor-pointer" placement="right" arrow>
                                                            <motion.div whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.2 }}
                                                                onHoverStart={e => { }}
                                                                onHoverEnd={e => { }} onClick={() => handleCommit(index, item)} key={index} className={`z-10 w-4 h-4 rounded-full `}
                                                                style={discardingCommit.includes(item.commitId) ? { backgroundColor: '#ef0b60' } : { backgroundColor: item.color }}
                                                            >
                                                            </motion.div>
                                                        </LightTooltip>
                                                        <motion.div
                                                            transition={{ type: "spring", duration: 5 }} className="z-0 ml-1.5 border w-0 h-10 border-slate-300" style={discardingCommit.includes(item.commitId) ? { borderColor: '#ef0b60' } : {}}></motion.div>
                                                    </motion.div>
                                                )}
                                            </div>
                                            <div className="mt-4">
                                                {commitLogs?.slice().reverse()?.map((item: any, index: number) => <motion.div animate={{ y: 6 }}
                                                    transition={{ type: "spring" }} style={discardingCommit.includes(item.commitId) ? { color: '#ef0b60' } : {}} key={index} className="text-xs ml-7 w-fit h-14 ">{item.time}</motion.div>)}
                                            </div>
                                        </div>
                                    </div>
                                </CustomTabPanel>
                                <CustomTabPanel value={tabValue} index={1} >
                                    Nothing to display
                                </CustomTabPanel>
                            </Box> */}
                            <div className="relative flex items-center overflow-auto flex-col w-full h-fit bg-white  rounded-lg">
                                {discardingCommit.length > 0 ? <motion.div animate={{ y: 6 }} className="flex  mb-4" transition={{ type: "spring", duration: 1 }}>
                                    <motion.div onClick={() => handleKeep()} whileHover={{ scale: 1.1 }} className="rounded-lg text-xs flex cursor-pointer mr-10"><BookCheck color="#00a1ff" size={18} className="mr-2" /> <span className="pt-0.5">Keep</span> </motion.div>
                                    <motion.div onClick={() => deleteCommit()} whileHover={{ scale: 1.1 }} className="text-xs flex cursor-pointer "><Trash color="#ef0b60" size={18} className="mr-2" /> <span className="pt-0.5">Remove</span> </motion.div>
                                </motion.div> : <div className=" mb-4"></div>}
                                <div className="flex flex-cols">
                                    <div className="mt-4 force-overflow pb-10">
                                        {commitLogs?.slice().reverse().map((item: any, index: number) =>
                                            <motion.div
                                                key={index}
                                                // style={discardingCommit.includes(item.commitId) ? { backgroundColor: '#ffd3df' } : {}}
                                                animate={{ y: 6 }}
                                                transition={{ type: "spring" }}
                                            >
                                                <LightTooltip title=
                                                    {<div>
                                                        <Typography className="font-sans text-sm" style={{ backgroundColor: '#ffffff', color: 'black' }}><span className="text-sm font-sans font-semibold mr-2" style={{ color: `${item.color}` }}>From Card:</span> {item.fromCard} </Typography>
                                                        <Typography className="font-sans font-sans text-sm" style={{ backgroundColor: '#ffffff' }}><span className="text-sm font-semibold  mr-2 font-sans" style={{ color: `${item.color}` }}>To Card:</span>  {item.toCard}</Typography>
                                                        <Typography className="font-sans font-sans text-sm" style={{ backgroundColor: '#ffffff' }}>
                                                            <span style={{ color: `${item.color}` }} className=" font-sans font-semibold mr-2 text-sm">Title:</span>  {item.title.title}</Typography>
                                                    </div>}
                                                    className="cursor-pointer" placement="right" arrow>
                                                    <motion.div whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.2 }}
                                                        onHoverStart={e => { }}
                                                        onHoverEnd={e => { }} onClick={() => handleCommit(index, item)} key={index} className={`z-10 w-4 h-4 rounded-full `}
                                                        style={discardingCommit.includes(item.commitId) ? { backgroundColor: '#ef0b60' } : { backgroundColor: item.color }}
                                                    >
                                                    </motion.div>
                                                </LightTooltip>
                                                <motion.div
                                                    transition={{ type: "spring", duration: 5 }} className="z-0 ml-1.5 border w-0 h-10 border-slate-300" style={discardingCommit.includes(item.commitId) ? { borderColor: '#ef0b60' } : {}}></motion.div>
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        {commitLogs?.slice().reverse()?.map((item: any, index: number) => <motion.div animate={{ y: 6 }}
                                            transition={{ type: "spring" }} style={discardingCommit.includes(item.commitId) ? { color: '#ef0b60' } : {}} key={index} className="text-xs ml-7 w-fit h-14 ">{item.time}</motion.div>)}
                                    </div>
                                </div>
                            </div>
                        </motion.div> : null}
                    </div>
                </div>
            </div>
        </div >
    )
}