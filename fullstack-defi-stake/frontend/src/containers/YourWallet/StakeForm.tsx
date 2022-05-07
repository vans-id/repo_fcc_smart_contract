import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Token } from '../../utils/helper';
import { useEthers, useTokenBalance, useNotifications } from '@usedapp/core';
import { formatUnits } from '@ethersproject/units';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import useStakeTokens from '../../hooks/useStakeTokens';
import { utils } from 'ethers';
import { Box } from '@mui/system';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { APPROVE_TOKENS, STAKE_TOKENS } from '../../utils/constants';
import SliderInput from '../../components/SliderInput';

export interface StakeFormProps {
  /** @typedef {import('../../utils/helper').Token} Token */
  token: Token;
}

/**
 * Component for stake user's token.
 *
 * @component
 * @example
 * const token: Token = {
 *    image: "./src/image.png",
 *    address: "0x00",
 *    name: "CREW"
 * }
 * return <StakeForm token={token} />
 */
const StakeForm = ({ token: { image, address, name } }: StakeFormProps) => {
  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isStaked, setIsStaked] = useState(false);

  const { account } = useEthers();
  const tokenBalance = useTokenBalance(address, account);
  const { approveAndStake, state } = useStakeTokens(address);
  const { notifications } = useNotifications();

  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;
  const isMining = state.status === 'Mining';
  const hasZeroBalance = formattedTokenBalance === 0;
  const hasZeroAmountSelected = parseFloat(amount.toString()) === 0;

  /**
   * approve transaction on deposit click
   * @returns   {Promise<void>}  approve popup window
   */
  const handleSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString()).toString();
    return approveAndStake(amountAsWei);
  };

  /**
   * setIsApproved and setIsStaked to `false` on snackbar closed
   */
  const handleCloseSnack = () => {
    setIsApproved(false);
    setIsStaked(false);
  };

  /**
   * Changes state on receive notifications
   * Runs everytime `notifications`, `isApproved`, `isStaked` changes
   */
  useEffect(() => {
    if (
      notifications.filter(
        (notif) =>
          notif.type === 'transactionSucceed' &&
          notif.transactionName === APPROVE_TOKENS
      ).length > 0
    ) {
      setIsApproved(true);
      setIsStaked(false);
    }

    if (
      notifications.filter(
        (notif) =>
          notif.type === 'transactionSucceed' &&
          notif.transactionName === STAKE_TOKENS
      ).length > 0
    ) {
      setIsApproved(false);
      setIsStaked(true);
    }
  }, [notifications, isApproved, isStaked]);

  return (
    <>
      <StakeContainer>
        <SliderInput
          image={image}
          maxValue={formattedTokenBalance}
          id={`slider-input-${name}`}
          value={amount}
          onChange={setAmount}
          disabled={isMining || hasZeroBalance}
        />

        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          disabled={isMining || hasZeroAmountSelected}
          fullWidth
          size='large'
          style={{ marginTop: '1rem' }}
        >
          {isMining ? <CircularProgress /> : 'Submit'}
        </Button>
      </StakeContainer>

      {/* Snackbars */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isApproved}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity='success'>
          Transaction approved!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isStaked}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity='success'>
          Transaction confirmed!
        </Alert>
      </Snackbar>
    </>
  );
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const StakeContainer = styled(Box)(
  ({ theme }) => `
  margin-top: 2rem;
`
);

export default StakeForm;
