import { useEffect, useRef, useState } from "react";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/common/Dialog";
import { Button } from "@/components/common/Button";
import { Response } from "@/components/common/Response";
import { ShimmeringText } from "@/components/common/ShimmeringText";

import { useAuth } from "@/AuthProvider";
import { aiService } from "@/services/AIService";
import { scheduledEventsAtom } from "@/atoms/eventsAtom";

import { DocumentDuplicateIcon, XMarkIcon } from "@heroicons/react/24/outline";

const blurVariants = {
  initial: { filter: "blur(16px)", opacity: 0.4 },
  animate: { filter: "blur(0px)", opacity: 1 },
};

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisPopup = ({ isOpen, onClose }: IProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { accessToken } = useAuth();
  const scheduledEvents = useAtomValue(scheduledEventsAtom);

  const hasContent = isLoading || responseText;

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      return;
    }
    setResponseText("");
    setPrompt("");
  }, [isOpen]);

  const handleCopy = async () => {
    if (!responseText) return;

    try {
      await navigator.clipboard.writeText(responseText);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !accessToken || isLoading) {
      return;
    }

    setIsLoading(true);
    setPrompt("");

    try {
      const response = await aiService.analyseChat(accessToken, prompt, scheduledEvents);
      setResponseText(response.response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to analyse chat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        hasOverlay={false}
        aria-describedby={undefined}
        className="sm:max-w-[640px] max-w-[90%] backdrop-blur-2xl bg-opacity-90 p-4 [&>button:last-of-type]:hidden"
        onOpenAutoFocus={event => {
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <VisuallyHidden.Root asChild>
          <DialogTitle>Calendar Assistant</DialogTitle>
        </VisuallyHidden.Root>
        <motion.div
          variants={blurVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col"
        >
          <AnimatePresence>
            {hasContent && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <img src="/logo-black.svg" alt="allocate" className="h-5 w-5 opacity-60" />
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={handleCopy}
                      disabled={!responseText}
                      className="h-8 w-8 text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-30"
                    >
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    </Button>
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="h-8 w-8 text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </Button>
                    </DialogClose>
                  </div>
                </div>
                {isLoading && (
                  <div className="flex items-center justify-center py-6">
                    <ShimmeringText
                      text="allocate is thinking..."
                      className="text-sm text-slate-500"
                      duration={1.5}
                    />
                  </div>
                )}
                {responseText && !isLoading && (
                  <div className="pt-1.5 pb-2 text-sm leading-6">
                    <Response className="max-h-64 overflow-y-auto pr-1 text-sm leading-6">
                      {responseText}
                    </Response>
                  </div>
                )}
                <div className="-mx-4 h-px bg-slate-200 mb-2" />
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 text-sm text-slate-600">
            <input
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="How many hours did I spend on allocate this month?"
              className="flex-1 bg-transparent p-0 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              ref={inputRef}
            />
            <Button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              variant="ghost"
              className="h-8 rounded-md border border-slate-200/70 px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100/60 disabled:border-slate-200/40 disabled:text-slate-400"
            >
              {isLoading ? "..." : "Submit"}
            </Button>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisPopup;
