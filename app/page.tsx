'use client';

import { WasteEditForm } from "@/components/edit/waste";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
export default function Home() {
  const { toast } = useToast()
  return (
    <div>
      Nothing
      <WasteEditForm waste_id={3} />
    </div>
  );
}

