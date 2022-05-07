import React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Snackbar, AlertColor } from '@mui/material';

interface CustomAlertProps {
  /** wether the alert displayed or not */
  open: boolean;
  /** this gets triggered when the alert closed */
  onClose: () => void;
  /** alert color, default value is success */
  severity?: AlertColor | undefined;
  /** alert message */
  message: string;
}

/**
 * Component to display notification to user
 *
 * @component
 */
const CustomAlert = ({
  open,
  onClose,
  severity = 'success',
  message,
}: CustomAlertProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={3} ref={ref} variant='standard' {...props} />;
});

export default CustomAlert;
