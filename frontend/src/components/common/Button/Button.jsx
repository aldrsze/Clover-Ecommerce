import './Button.css';

export const Button = ({ children, variant = 'primary', className = '', onClick, ...props }) => {
  const variantClass = (variant && variant !== 'none') ? `btn-${variant}` : '';
  return (
    <button 
      className={`${variantClass} ${className}`.trim()} 
      onClick={onClick} 
      {...props}
    >
      {children}
    </button>
  );
};