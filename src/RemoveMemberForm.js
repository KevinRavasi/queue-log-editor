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

export default function RemoveMemberForm({ onChange }) {
    const classes = useStyles();

    const [agentExtension, setAgentExtension] = useState(localStorage.getItem("agentExtension"));
    const [queue, setQueue] = useState(localStorage.getItem("queue"));

    useEffect(() => {
        onChange({
            agentExtension: agentExtension,
            queue: queue,
        });
    }, [agentExtension, queue, onChange]);

    return (
        <form className={classes.root} noValidate autoComplete="off">
            <TextField
                id="standard-basic"
                label="Agent Extension"
                onChange={(e) => setAgentExtension(e.target.value)}
                value={agentExtension}
            />
            <TextField
                id="standard-basic"
                label="Queue"
                onChange={(e) => setQueue(e.target.value)}
                value={queue}
            />
        </form>
    );
}
