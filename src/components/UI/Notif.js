import React from 'react';
import Button from '@material-ui/core/Button';
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
  buttonCancel: {
    marginRight: 10,
  },
  buttonProgress: {
    color: blue[500],
    position: 'absolute',
    top: '50%',
    right: '15%',
    marginTop: -12,
  },
}));

export default function Notif(props) {

  const classes = useStyles();
  
  return (
    <Dialog
        open={props.open}
        onClose={props.cancel?props.cancel:props.handleInfoClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {props.desc}
            </DialogContentText>
          </DialogContent>
        <DialogActions>
          {
            props.cancel ? (
              <div className={classes.wrapper}>
                <Button 
                onClick={props.cancel}         
                color="primary"
                className={classes.buttonCancel}                
              >
                  Cancel
                </Button>

                <Button onClick={props.handleInfoClose} disabled={props.loading} variant={props.cancel?"contained":"text"}
                  color="primary" autoFocus>
                      OK
                  </Button>  
                {props.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            ): (
              <Button onClick={props.handleInfoClose} variant={props.cancel?"contained":"text"}
                color="primary" autoFocus>
                    OK
                </Button>  
            )                   
          }
        </DialogActions>
    </Dialog>
  );
}
