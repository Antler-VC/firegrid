import React, { useState } from 'react';
import queryString from 'query-string';

import { Typography, Button } from '@material-ui/core';

import AuthCard from './AuthCard';
import GoogleButton from './GoogleButton';

import { handleGoogleAuth } from './utils';
import { useSnackContext } from 'samosas';
export default function GoogleAuthPage() {
  const [loading, setLoading] = useState(false);
  const snack = useSnackContext();
  const parsedQuery = queryString.parse(window.location.search);

  return (
    <AuthCard height={400} loading={loading}>
      <Typography variant="overline">Google Account</Typography>
      <Typography variant="body1">
        It looks like the following account was previously used to sign in with
        Google: <b>{parsedQuery.email}</b>
      </Typography>

      <GoogleButton
        onClick={() => {
          setLoading(true);
          handleGoogleAuth(
            () => {
              setLoading(false);
              window.location.replace('/');
            },
            (error: Error) => {
              setLoading(false);
              snack.open({ message: error.message });
            },
            parsedQuery.email as string
          );
        }}
      />
    </AuthCard>
  );
}
