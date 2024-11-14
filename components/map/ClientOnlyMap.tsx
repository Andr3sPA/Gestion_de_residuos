import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const LMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  },
});

const GMap = dynamic(() => import("./GeneralMap"), {
  ssr: false,
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  },
});

export { LMap, GMap };
