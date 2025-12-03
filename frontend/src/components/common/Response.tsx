import { memo } from "react";

import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

type ResponseProps = {
  children: string;
  className?: string;
};

const ResponseComponent = ({ children, className }: ResponseProps) => {
  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        components={{
          ul: ({ node, ...props }) => <ul className="my-2 ml-4 list-disc" {...props} />,
          ol: ({ node, ...props }) => <ol className="my-2 ml-4 list-decimal" {...props} />,
          li: ({ node, ...props }) => <li className="my-1" {...props} />,
          p: ({ node, ...props }) => <p className="my-2" {...props} />,
          h1: ({ node, ...props }) => <h1 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
          h2: ({ node, ...props }) => (
            <h2 className="mt-3 mb-2 text-base font-semibold" {...props} />
          ),
          h3: ({ node, ...props }) => <h3 className="mt-2 mb-1 text-sm font-semibold" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

export const Response = memo(ResponseComponent);
