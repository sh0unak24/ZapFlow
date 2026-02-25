import { Handle, Position } from "@xyflow/react";

// interface CustomZapNodeProps {
//   data: {
//     title: string;
//     description: string;
//     stepNumber: number;
//     image  : string,
//     availableActionId : string,
//     availableTriggerId : string
//   };
// }

type CustomZapNodeProps = {
  data : {
    stepNumber: number;
    title: string;
    description: string;
    image?: string;

    // backend-related
    availableTriggerId?: string;
    availableActionId?: string;
    actionName?: string;

    metadata?: Record<string, any>;
  }
};

export default function CustomZapNode({ data }: CustomZapNodeProps) {
  return (
    <div className="w-65 rounded-lg border border-gray-200 bg-white p-3 shadow-[0_4px_12px_rgba(0,0,0,0.08)] font-sans">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
          {data.stepNumber}
        </span>
            {!data.image ? "" : (
              <img
              src={data.image}
              alt={data.title}
              className="w-10 h-10 object-cover"
            />
          )}
        {data.title}
      </div>

      <div className="my-2 h-px bg-gray-200" />

      <div className="text-xs leading-relaxed text-gray-500">
        {data.description}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}