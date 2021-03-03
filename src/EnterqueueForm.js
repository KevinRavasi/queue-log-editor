import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

export default function EnterqueueForm({ onChange }) {
    const classes = useStyles();

    const [callUniqueId, setCallUniqueId] = useState(localStorage.getItem("callUniqueId"));
    const [queue, setQueue] = useState(localStorage.getItem("queue"));
    const [callerId, setCallerId] = useState(localStorage.getItem("callerId"));
    const [position, setPosition] = useState(localStorage.getItem("position"));

    useEffect(() => {
        onChange({
            callUniqueId: callUniqueId,
            queue: queue,
            callerId: callerId,
            position: position,
        });
    }, [callUniqueId, queue, callerId, position, onChange]);

    return (
        <form className={classes.root} noValidate autoComplete="on">
            <TextField
                id="standard-basic"
                label="Call Unique Id"
                onChange={(e) => setCallUniqueId(e.target.value)}
                value={callUniqueId}
            />
            <TextField
                id="standard-basic"
                label="Queue"
                onChange={(e) => setQueue(e.target.value)}
                value={queue}
            />
            <TextField
                id="standard-basic"
                label="Caller ID"
                onChange={(e) => setCallerId(e.target.value)}
                value={callerId}
            />
            <TextField
                id="standard-basic"
                label="Position"
                onChange={(e) => setPosition(e.target.value)}
                value={position}
            />
        </form>
    );
}
