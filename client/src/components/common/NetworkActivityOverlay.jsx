const NetworkActivityOverlay = () => (
  <div className="fixed top-0 left-0 w-full h-1 z-[10000] overflow-hidden pointer-events-none">
    <div className="w-full h-full bg-accent/20">
      <div className="h-full bg-accent animate-[loading_2s_infinite_linear]" style={{ width: '30%' }} />
    </div>
    <style>
      {`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}
    </style>
  </div>
);

export default NetworkActivityOverlay;
