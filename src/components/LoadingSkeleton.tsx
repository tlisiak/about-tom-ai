const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[hsl(150,30%,8%)] flex items-center justify-center p-6">
    <div className="max-w-4xl w-full mx-auto backdrop-blur-md bg-black/30 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
      <div className="text-center animate-pulse">
        {/* Avatar skeleton */}
        <div className="w-32 h-32 mx-auto rounded-full bg-white/10 mb-8" />
        
        {/* Name skeleton */}
        <div className="h-12 w-64 mx-auto bg-white/10 rounded-lg mb-4" />
        
        {/* Subtitle skeleton */}
        <div className="h-6 w-80 mx-auto bg-white/10 rounded mb-8" />
        
        {/* Bio skeleton */}
        <div className="space-y-3 max-w-3xl mx-auto mb-8">
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-11/12" />
          <div className="h-4 bg-white/10 rounded w-10/12" />
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-9/12" />
        </div>
        
        {/* Button skeletons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="h-12 w-32 bg-white/10 rounded-xl" />
          <div className="h-12 w-32 bg-white/10 rounded-xl" />
          <div className="h-12 w-32 bg-white/10 rounded-xl" />
          <div className="h-12 w-28 bg-white/10 rounded-xl" />
        </div>
        
        {/* Fun Projects section skeleton */}
        <div className="h-8 w-40 mx-auto bg-white/10 rounded mb-4" />
        <div className="flex flex-wrap justify-center gap-4">
          <div className="h-12 w-36 bg-white/10 rounded-xl" />
          <div className="h-12 w-36 bg-white/10 rounded-xl" />
          <div className="h-12 w-32 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;
