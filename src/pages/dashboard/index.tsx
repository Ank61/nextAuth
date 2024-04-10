import React, { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';
import { Users } from 'lucide-react';
import { Earth } from 'lucide-react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { boardCreationSchema, titleSchema } from "@/validators/board";
import { json } from "stream/consumers";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import { useRecoilState } from "recoil";
import { analytics } from "@/global/boardAnalytics";



export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const { data: session }: any = useSession();
  const [anchorElDash, setAnchorElDash] = React.useState(null);
  const openDash = Boolean(anchorElDash);
  const [titleError, setTitleError] = React.useState({ check: false, message: "" })
  const [visibility, setVisibility] = React.useState<String>("Visibilty")
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [boards, setBoards] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchBoards();
    console.log("Boards", boards)
  }, [])

  const fetchBoards = async () => {
    const response: any = await fetch("http://localhost:3000/api/routes/board/fetch");
    const allBoards = await response.json();
    console.log("Response from the ", allBoards);
    setBoards(allBoards.result)
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleTitle = async (event: any) => {
    setTitle(event.target.value)
    try {
      const validate = await titleSchema.parse(event.target.value);
      setTitleError({ check: false, message: "" })
    }
    catch (error: any) {
      debugger
      const response = await JSON.parse(error.message)
      setTitleError({ check: true, message: response[0].message })
    }
  }

  const handleClick = (event: any) => {
    setAnchorElDash(event.currentTarget);
  };

  const handleClose = (selected: String) => {
    setAnchorElDash(null);
    setVisibility(selected);
  };

  const handleConfirm = async () => {
    const board = {
      board: {
        title: title,
        workspace: visibility,
        email: session.user?.email
      }
    }

    const response = await fetch('http://localhost:3000/api/routes/board/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(board)
    })
    if (!response.ok) {
      console.error('Failed to create post');
    }
    fetchBoards();
    setOpen(false)
    console.log('Board Creation');
  };

  const handleBoard = (title:String) => {
    router.push(`/board/${title}`);
  }
  return (
    <div><Header />
      <div className="flex flex-row w-full">
        <Sidebar />
        <div className="m-6 h-fit w-full">
          <div className="grid grid-cols-4 gap-8">
            <div onClick={handleClickOpen} className="w-fit p-6 cursor-pointer rounded-lg font-medium	font-sans text-white subpixel-antialiased " style={{ backgroundColor: '#39b4fc' }}>
              Create a Board
            </div>
          </div>

          <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>

          <div className="grid grid-cols-4 gap-4 mt-4">
            {boards?.map((item: any, index: any) => <div className="w-4/6 text-center p-8 cursor-pointer rounded-lg font-medium	font-sans text-white subpixel-antialiased" style={{ backgroundColor: '#39b4fc' }} key={index} onClick={() => handleBoard(item.title)}>{item.title}</div>)}
          </div>

        </div>
      </div>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={() => handleClose('Visibilty')}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" style={{ display: 'flex' }} className="text-black">
            {"Create Board"} <X className="ml-auto" onClick={()=>setOpen(false)}
            />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" className="mt-2">
              <div className="mt-2 mb-1 text-sm text-base font-semibold text-black">Board Title </div>
              <TextField
                error={titleError.check}
                className="w-full"
                id="outlined-error"
                size="small"
                color="primary"
                value={title}
                onChange={(e) => handleTitle(e)}
              />
              {titleError.check ? <span className="text-red-400 text-xs">{titleError.message}</span> : null}
              <br>
              </br>
              <div className="mt-8 mb-1 text-sm text-base font-semibold text-black">WorkSpace</div>
              <div className="w-full flex justify-center ">
                <Button
                  fullWidth
                  className="border"
                  id="basic-button"
                  aria-controls={openDash ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDash ? 'true' : undefined}
                  onClick={handleClick}
                  variant="outlined"
                >
                  {visibility} {anchorElDash ? <ChevronUp /> : <ChevronDown />}
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorElDash}
                  open={openDash}
                  onClose={() => handleClose('Visibility')}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={() => handleClose('Private')} >Private</MenuItem>
                  <MenuItem onClick={() => handleClose('Public')} >Public</MenuItem>
                </Menu>
              </div>
              <Button
                fullWidth
                // disabled={visibility !== 'Public' || visibility !== 'Private'}
                style={visibility === 'Public' || visibility === 'Private' ?
                  {
                    marginTop: '12%',
                    border: 'none',
                    color: 'white',
                    fontSize: 'smaller',
                    backgroundColor: '#1976d2',
                    textTransform: 'unset',
                    fontWeight: 600
                  }
                  :
                  {
                    marginTop: '12%',
                    border: 'none',
                    color: '#b3b3b3',
                    fontSize: 'smaller',
                    backgroundColor: '#e7e7e7',
                    textTransform: 'unset',
                    fontWeight: 600
                  }}
                color="info" variant="outlined"
                //onClick={handleClose}
                onClick={() => handleConfirm()} >Confirm</Button>
              <Button
                fullWidth
                className="blackButton w-full" variant="outlined"
              //onClick={handleClose}
              >Start with template</Button>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div >
  );
};
