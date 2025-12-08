interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  const content = (
    <div className="text-center">
      <div className={`animate-spin rounded-full border-b-2 border-bronze-600 mx-auto mb-4 ${sizes[size]}`}></div>
      {message && <p className="text-charcoal">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}



