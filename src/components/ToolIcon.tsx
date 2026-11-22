import {
  Image, FileText, GraduationCap, Briefcase, Code, Type, Minimize2, Target, Scaling, FileImage, Crop, Combine, Split, FileOutput,
  RotateCw, Images, FileArchive, Layers, Percent, ClipboardList, BarChart3, Clock, TrendingUp, Tag, BadgePercent, ArrowUpRight,
  Scale, Truck, Receipt, Braces, CheckCircle2, Binary, Link, Fingerprint, FileCode, Ampersand, CalendarClock, Regex, Hash,
  LetterText, CaseSensitive, Repeat, Eraser, GitCompare, Code2, Link2, Bot, Network, Wrench, type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Image, FileText, GraduationCap, Briefcase, Code, Type, Minimize2, Target, Scaling, FileImage, Crop, Combine, Split, FileOutput,
  RotateCw, Images, FileArchive, Layers, Percent, ClipboardList, BarChart3, Clock, TrendingUp, Tag, BadgePercent, ArrowUpRight,
  Scale, Truck, Receipt, Braces, CheckCircle2, Binary, Link, Fingerprint, FileCode, Ampersand, CalendarClock, Regex, Hash,
  LetterText, CaseSensitive, Repeat, Eraser, GitCompare, Code2, Link2, Bot, Network,
};

export default function ToolIcon({ name, className }: { name: string; className?: string }) {
  const I = icons[name] || Wrench;
  return <I className={className} aria-hidden />;
}
