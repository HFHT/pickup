import './button.css';

interface IButton {
  startIcon?: JSX.Element;
  endIcon?: JSX.Element;
  onClick?(e: HTMLButtonElement | null): Function | void;
  variant?: string;
  classes?: string;
  color?: string;
  size?: string;
  disabled?: boolean;
  hidden?: boolean;
  left?: boolean;
  mid?: boolean;
  right?: boolean;
  href?: string;
  children?: React.ReactNode;
}

export const Button = ({ startIcon, endIcon, onClick, variant = 'contained', color = 'none', classes = '', disabled = false, hidden = false, left = false, mid = false, right = false, children }: IButton) => {

  const theVariant: any = {
    text: 'buttontext',
    contained: 'buttoncontained',
    outlined: 'buttonoutlined',
    pill: '',
    close: ''
  }[variant];

  const theColor: any = {
    red: '',
    blue: '',
    green: '',
    none: ''
  }[color];
  const hide: any = hidden ? 'buttonhidden' : '';
  let position: string = 'buttonfull';
  left && (position = 'buttonleft')
  mid && (position = 'buttonmiddle')
  right && (position = 'buttonright')

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(e.currentTarget.closest('button'));
  }

  return (
    <>
      <button type="button" className={`buttonmain text-sm ${hide} ${theVariant} ${position} ${classes}`} disabled={disabled} onClick={(e) => handleClick(e)}>
        <span className={startIcon && "buttoniconleft"} >
          {startIcon && startIcon}
        </span>
        {children}
        <span className={endIcon && "buttoniconright"} >
          {endIcon && endIcon}
        </span>
      </button>
    </>
  )
}


