import dynamic from "next/dynamic";

const LMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => {
    return <span>Loading...</span>;
  },
});

export default LMap;
