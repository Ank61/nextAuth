import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { Plus } from 'lucide-react';


export default function BoardName() {
    const [cards, setCards] = useState([{
        cardName: "Stuff to Try (this is a list)",
        items: [{ title: "Swipe left or right to see other lists on this board." }],
    }, {
        cardName: "Try it ( Another Board )",
        items: [{ title: "Done with this board? Tap Archive board in the board settings menu to close it." }, { title: "Tap and hold a card to pick it up and move it. Try it now!" }, { title: "Create as many cards as you want, we've got an unlimited supply!" },{ title: "Tap this card to open it and see more details." },{ title: "Start using Trello!" }],
    }])
    const [picked, setPicked] = useState<any>({});
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedTitle, setSelectedTitle] = useState<any>();

    let rIndex: number;

    // useEffect(() => {
    //     console.log("cards Data", cards)
    // }, [cards])

    const handleDropped = (recievedElements: any, index: any) => {
        debugger;
        console.log("Revieing in", recievedElements, index);
        console.log("Recieved ", picked);
        cards.map(item => {
            if (item.cardName === picked) {
                //Delete the element
                item.items.splice(selectedIndex, 1);
            }
            if (item.cardName === recievedElements.cardName) {
                //Add the element
                console.log("Inside teh recing index", rIndex)
                item.items.splice(rIndex, 0, selectedTitle);
                rIndex = 0;
            }
        });
        setCards([...cards]);
    }

    const handleDragStart = (element: any, index: any, ele: any) => {
        debugger;
        setPicked(element);
        setSelectedIndex(index);
        setSelectedTitle(ele);
    }

    const allowDrag = (event: any) => {
        event.preventDefault();
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
                                    <p  className="font-sans text-sm font-medium mt-2 mb-5">{elements.cardName}</p>
                                    {elements.items.map((ele: any, indexKey: any) =>
                                        <div draggable onDragStart={() => handleDragStart(elements.cardName, indexKey, ele)} key={indexKey} onDrop={() => { rIndex = indexKey; console.log("Hit..", indexKey) }} className="flex justify-center cursor-pointer  items-center w-11/12 h-auto mb-2 bg-sky-200/100 rounded-lg mt-2 font-sans text-sm font-normal break-words pl-4 pr-4 pt-2 pb-2">{ele.title}</div>)}
                                        <div className="flex justify-start w-11/12 font-sans text-sm font-medium m-3">
                                           <Plus size={19} className="mr-3"/> Add a Card
                                        </div>
                                </div>
                            </>)}
                            <div className="flex justify-center items-center w-fit h-fit font-sans text-sm pl-8  pr-8 pt-2 pb-2 font-medium text-white rounded-lg" style={{backgroundColor : '#00a1ff'}}>
                            <Plus size={19} className="mr-3"/>   Add Another List
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}