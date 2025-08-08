export function NatureBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-nebula-dark via-nebula-deep to-mountain-gray">
      {/* Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Multiple star layers for depth */}
        <div className="star absolute w-1 h-1 top-[10%] left-[15%] animate-twinkle" style={{animationDelay: '0s'}}></div>
        <div className="star absolute w-1 h-1 top-[20%] left-[25%] animate-twinkle" style={{animationDelay: '1s'}}></div>
        <div className="star absolute w-1 h-1 top-[15%] left-[35%] animate-twinkle" style={{animationDelay: '2s'}}></div>
        <div className="star absolute w-1 h-1 top-[25%] left-[45%] animate-twinkle" style={{animationDelay: '0.5s'}}></div>
        <div className="star absolute w-1 h-1 top-[18%] left-[55%] animate-twinkle" style={{animationDelay: '1.5s'}}></div>
        <div className="star absolute w-1 h-1 top-[12%] left-[65%] animate-twinkle" style={{animationDelay: '2.5s'}}></div>
        <div className="star absolute w-1 h-1 top-[22%] left-[75%] animate-twinkle" style={{animationDelay: '0.3s'}}></div>
        <div className="star absolute w-1 h-1 top-[8%] left-[85%] animate-twinkle" style={{animationDelay: '1.8s'}}></div>
        
        {/* Additional smaller stars */}
        <div className="star absolute w-0.5 h-0.5 top-[5%] left-[20%] animate-twinkle" style={{animationDelay: '0.7s'}}></div>
        <div className="star absolute w-0.5 h-0.5 top-[30%] left-[30%] animate-twinkle" style={{animationDelay: '2.2s'}}></div>
        <div className="star absolute w-0.5 h-0.5 top-[8%] left-[40%] animate-twinkle" style={{animationDelay: '1.3s'}}></div>
        <div className="star absolute w-0.5 h-0.5 top-[28%] left-[60%] animate-twinkle" style={{animationDelay: '0.9s'}}></div>
        <div className="star absolute w-0.5 h-0.5 top-[15%] left-[70%] animate-twinkle" style={{animationDelay: '2.7s'}}></div>
        <div className="star absolute w-0.5 h-0.5 top-[35%] left-[80%] animate-twinkle" style={{animationDelay: '1.1s'}}></div>
      </div>

      {/* Moon */}
      <div className="moon absolute w-24 h-24 rounded-full top-[8%] right-[15%] animate-float"></div>

      {/* Mountain Layers (back to front) */}
      <div className="mountain-layer-1 absolute inset-0 opacity-60"></div>
      <div className="mountain-layer-2 absolute inset-0 opacity-75"></div>
      <div className="mountain-layer-3 absolute inset-0 opacity-90"></div>

      {/* River */}
      <div className="river-path absolute inset-0 opacity-70 animate-river-flow"></div>
    </div>
  );
}
