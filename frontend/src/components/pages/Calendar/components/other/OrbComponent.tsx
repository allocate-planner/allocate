import { XMarkIcon } from "@heroicons/react/24/outline";

interface IProps {
  onStop: () => void;
  isProcessing: boolean;
  className?: string;
}

const OrbComponent = ({ onStop, isProcessing, className = "" }: IProps) => {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-50 ${className}`}>
      {isProcessing ? (
        <div className="flex w-full items-center justify-center bg-white py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent" />
        </div>
      ) : (
        <video autoPlay muted loop playsInline className="w-full rounded-lg">
          <source src="/orb/allocate_orb.webm" type="video/webm" />
        </video>
      )}
      <button
        onClick={onStop}
        type="button"
        className="absolute top-0 right-0 p-2"
        aria-label="Stop recording"
      >
        {isProcessing ? "" : <XMarkIcon className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default OrbComponent;
