import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = '错误',
  message,
  onClose,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error" onClose={onClose}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
}; 