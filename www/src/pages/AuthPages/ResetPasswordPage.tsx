import React, { useState } from 'react';

import { Typography, TextField } from '@material-ui/core';
import { CtaButton } from '@antlerengineering/components';

import AuthCard from './AuthCard';
import { auth } from '../../firebase';
import { useSnackContext } from 'samosas';

export default function ResetPasswordPage() {
  const snack = useSnackContext();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <AuthCard height={420} loading={loading}>
      <Typography variant="overline">RESET PASSWORD</Typography>
      <Typography variant="body1">
        Welcome back! Please type a new password for your account and confirm.
      </Typography>
      <TextField
        label={'Type Password'}
        name={'password'}
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <TextField
        type="password"
        label={'Confirm Password'}
        name={'confirmPassword'}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
        }}
      />

      <CtaButton
        onClick={async () => {
          if (auth.currentUser) {
            try {
              if (password === confirmPassword) {
                setLoading(true);
                await auth.currentUser.updatePassword(password);
                setLoading(false);
                window.location.replace('/');
              } else {
                snack.open({ message: 'Passwords don’t match' });
              }
            } catch (error) {
              setLoading(false);
              snack.open({ message: error.message });
            }
          }
        }}
      >
        Reset Password
      </CtaButton>
    </AuthCard>
  );
}
