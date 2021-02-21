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

export default function UnpauseAllForm({ onChange }) {
    const classes = useStyles();

    const [agentExtension, setAgentExtension] = useState(localStorage.getItem("agentExtension"));
    const [pauseCode, setPauseCode] = useState(localStorage.getItem("pauseCode"));

    useEffect(() => {
        onChange({
            agentExtension: agentExtension,
            pauseCode: pauseCode,
        });
    }, [agentExtension, pauseCode, onChange]);

    return (
        <form className={classes.root} noValidate autoComplete="on">
            <TextField
                id="standard-basic"
                label="Agent Extension"
                onChange={(e) => setAgentExtension(e.target.value)}
                value={agentExtension}
            />
        </form>
    );
}
