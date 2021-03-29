import React from 'react';

import { CtaButton } from '@antlerengineering/components';
import { ButtonProps } from '@material-ui/core';
import GoogleLogo from 'assets/google-icon.svg';

export default function GoogleButton(props: Partial<ButtonProps<any>>) {
  return (
    <CtaButton
      variant="contained"
      fullWidth
      startIcon={
        <img
          src={GoogleLogo}
          width={16}
          height={16}
          style={{
            marginRight: 8,
            marginLeft: -8,
            display: 'block',
            backgroundColor: '#fff',
            borderRadius: '50%',
            padding: 12,
            boxSizing: 'content-box',
          }}
        />
      }
      {...props}
    >
      Sign in with Google
    </CtaButton>
  );
}
