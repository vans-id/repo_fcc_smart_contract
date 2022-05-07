import { styled } from '@mui/material/styles';
import { Box, Slider, InputAdornment, Avatar, TextField } from '@mui/material';

interface SliderInputProps {
  /** token image */
  image?: string;
  /** Slider id */
  id?: string;
  /** slider's max value */
  maxValue: number;
  /** slider's current value */
  value: number | string | (string | number)[];
  /** function to change slider value */
  onChange: (newValue: number | string | Array<number | string>) => void;
  /** is slider's state disabled */
  disabled?: boolean;
  /** other params as string */
  [x: string]: any;
}

/**
 * Component for displaying Slider
 *
 * @component
 * @example
 * const [value, setValue] = useState(0)
 * return (
 *    <SliderInput
 *        image="../src/wbtc.png"
 *        id="slider-input-wbtc"
 *        maxValue={100.0}
 *        value={value}
 *        onChange={setValue}
 *        disabled={false}
 *    />
 * )
 */
const SliderInput = ({
  image = '',
  id = 'input-slider',
  maxValue,
  value,
  onChange,
  disabled = false,
  ...rest
}: SliderInputProps) => {
  const sliderStep = maxValue / 100;
  const inputStep = maxValue / 50;

  const SLIDER_MARKS = [
    { value: 0, label: '0%' },
    { value: maxValue, label: '100%' },
  ];

  const INPUT_PROPS = {
    step: inputStep,
    min: 0,
    max: maxValue,
    type: 'number',
    'aria-labelledby': id,
  };

  const ADORNMENT = {
    startAdornment: (
      <InputAdornment position='start'>
        <Avatar alt='token logo' src={image} sx={{ width: 24, height: 24 }} />
      </InputAdornment>
    ),
  };

  /**
   * Function to change slider's value
   * @param {any} e the event object
   * @param {number|number[]} newValue slider's new value
   */
  const handleSliderChange = (e: any, newValue: number | number[]) => {
    onChange(newValue);
  };

  /**
   * Function to change input's value
   * @param {React.ChangeEvent<HTMLInputElement>} e the event object
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value === '' ? '' : Number(e.target.value));
  };

  /**
   * Function for onBlur TextField component
   */
  const handleBlur = () => {
    if (value < 0) {
      onChange(0);
    } else if (value > maxValue) {
      onChange(maxValue);
    }
  };

  return (
    <div {...rest}>
      <InputsContainer>
        <div>
          <TextField
            fullWidth
            label='Enter Amount'
            type='number'
            variant='outlined'
            value={value}
            onBlur={handleBlur}
            onChange={handleInputChange}
            inputProps={INPUT_PROPS}
            InputProps={ADORNMENT}
            disabled={disabled}
          />
        </div>
        <div>
          <Slider
            value={typeof value === 'number' ? value : 0}
            step={sliderStep}
            onChange={handleSliderChange}
            aria-labelledby={id}
            max={maxValue}
            disabled={disabled}
            marks={disabled ? [] : SLIDER_MARKS}
            sx={{ my: 2 }}
          />
        </div>
      </InputsContainer>
    </div>
  );
};

const InputsContainer = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
`
);

export default SliderInput;
