import React,{ useEffect } from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonSuccess: {
      backgroundColor: blue[500],
      '&:hover': {
        backgroundColor: blue[700],
      },
    },
    buttonProgress: {
      color: blue[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
}));

export default function ModalForm(props) {
    const classes = useStyles();
    
    return (
        <Dialog open={props.toggleModal} onClose={props.closeModal} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {props.desc}
                </DialogContentText>
                <TextField
                autoFocus
                margin="dense"
                label={props.label?props.label:"Username"}
                type="text"
                helperText={props.error}
                value={props.inputUser}
                onChange={props.handleChange}
                fullWidth
                autoComplete="off"                
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.closeModal} color="primary">
                Cancel
                </Button>
                <div className={classes.wrapper}>
                  <Button 
                  onClick={props.onclick} 
                  variant="contained"
                  color="primary"
                  className={classes.buttonSuccess}
                  disabled={props.loading}
                  >
                    {props.action}
                  </Button>
                  {props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>
            </DialogActions>
        </Dialog>
    );
}
