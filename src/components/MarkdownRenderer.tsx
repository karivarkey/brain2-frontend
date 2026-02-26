import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Basic markdown component mapping for Tailwind without the typography plugin
const MarkdownComponents = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    p: ({ node, ...props }: any) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h1: ({ node, ...props }: any) => <h1 className="text-xl font-bold mb-3 mt-4 first:mt-0" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h2: ({ node, ...props }: any) => <h2 className="text-lg font-bold mb-2 mt-4 first:mt-0" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h3: ({ node, ...props }: any) => <h3 className="text-base font-bold mb-2 mt-4 first:mt-0" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    li: ({ node, ...props }: any) => <li className="pl-1" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    a: ({ node, ...props }: any) => <a className="underline decoration-black/30 hover:decoration-black transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    strong: ({ node, ...props }: any) => <strong className="font-semibold" {...props} />,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: ({ node, inline, className, children, ...props }: any) => {
        if (inline) {
            return <code className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
        }
        return (
            <div className="bg-[#1a1a1a] text-white rounded-xl p-4 my-4 overflow-x-auto text-sm font-mono shadow-sm">
                <code {...props}>{children}</code>
            </div>
        );
    }
};

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
