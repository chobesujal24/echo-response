export const TypingIndicator = () => {
  return (
    <div className="flex justify-start w-full animate-slide-up">
      <div className="bg-[#FFFAFA]/5 text-[#FFFAFA] px-4 py-3 rounded-2xl shadow-lg mr-12 border border-[#FFFAFA]/20 backdrop-blur-sm">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-[#FFFAFA]/60 rounded-full animate-typing"></div>
          <div className="w-2 h-2 bg-[#FFFAFA]/60 rounded-full animate-typing" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-[#FFFAFA]/60 rounded-full animate-typing" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};