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

export default function ConnectForm({ onChange }) {
    const classes = useStyles();

    const [callUniqueId, setCallUniqueId] = useState(localStorage.getItem("callUniqueId"));
    const [queue, setQueue] = useState(localStorage.getItem("queue"));
    const [agentExtension, setAgentExtension] = useState(localStorage.getItem("agentExtension"));

    useEffect(() => {
        onChange({
            callUniqueId: callUniqueId,
            queue: queue,
            agentExtension: agentExtension,
        });
    }, [callUniqueId, queue, agentExtension, onChange]);

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
                label="Agent Extension"
                onChange={(e) => setAgentExtension(e.target.value)}
                value={agentExtension}
            />
        </form>
    );
}
