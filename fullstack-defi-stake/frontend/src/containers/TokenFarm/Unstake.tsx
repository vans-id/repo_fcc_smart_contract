import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import { Token } from '../../utils/helper';
import { useNotifications } from '@usedapp/core';
import { formatUnits } from '@ethersproject/units';
import useStakingBalance from '../../hooks/useStakingBalance';
import useUnstakeTokens from '../../hooks/useUnstakeTokens';
import { Box } from '@mui/system';
import BalanceMsg from '../../components/BalanceMsg';
import { UNSTAKE_TOKENS } from '../../utils/constants';
import CustomAlert from '../../components/CustomAlert';

interface UnstakeProps {
  /** @typedef {import('../../utils/helper').Token} Token */
  token: Token;
}

/**
 * Component for showing the Main app's container
 *
 * @component
 */
const Unstake = ({ token: { image, address, name } }: UnstakeProps) => {
  const [isUnstaked, setIsUnstaked] = useState(false);

  const { notifications } = useNotifications();
  const balance = useStakingBalance(address);
  const { send, state } = useUnstakeTokens();

  const formattedBalance: number = balance
    ? parseFloat(formatUnits(balance, 18))
    : 0;
  const isMining = state.status === 'Mining';
  const isZero = parseFloat(formattedBalance.toString()) === 0;

  /**
   * Function that handles unstake click event
   * @return {Promise<void>} the send function
   */
  const onUnstakeSubmit = () => {
    return send(address);
  };

  /**
   * Function that handles close snackbar event
   */
  const handleCloseSnack = () => {
    setIsUnstaked(false);
  };

  /**
   * observe `notification` from useNotification and display them conditionally
   */
  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === 'transactionSucceed' &&
          notification.transactionName === UNSTAKE_TOKENS
      ).length > 0
    ) {
      setIsUnstaked(true);
    }
  }, [notifications, isUnstaked]);

  return (
    <>
      <UnstakeContainer>
        <BalanceMsg
          name={name}
          label={`Your staked ${name} balance`}
          amount={formattedBalance}
        />
        <Button
          color='primary'
          variant='contained'
          size='large'
          onClick={onUnstakeSubmit}
          disabled={isMining || isZero}
        >
          {isMining ? <CircularProgress size={26} /> : `Unstake all ${name}`}
        </Button>
      </UnstakeContainer>

      <CustomAlert
        open={isUnstaked}
        onClose={handleCloseSnack}
        message={'Transaction confirmed!'}
      />
    </>
  );
};

const UnstakeContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(4)}
`
);

export default Unstake;
