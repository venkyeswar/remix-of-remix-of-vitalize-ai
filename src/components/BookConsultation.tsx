import { useState } from "react";
import { Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Props {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
  label?: string;
  showIcon?: boolean;
}

export function BookConsultation({
  variant = "default",
  size = "default",
  className = "",
  label = "Book consultation",
  showIcon = true,
}: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={`rounded-full font-semibold ${className}`}>
          {showIcon && <Headset className="mr-1.5 h-4 w-4" />}
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-condensed text-2xl uppercase tracking-wide">
            Talk to a registered dietitian
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Free 15-min discovery call. We review your plan, answer questions, and arrange weekly meal delivery if you want it.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            toast.success("Our team will contact you within 24 hours 🎉");
          }}
          className="space-y-3 pt-2"
        >
          <input
            required
            placeholder="Full name"
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
          />
          <input
            required
            placeholder="Phone (with country code)"
            className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary"
          />
          <textarea
            placeholder="Anything we should know? (optional)"
            rows={3}
            className="w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-primary"
          />
          <Button type="submit" className="h-12 w-full rounded-xl">Request callback</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
