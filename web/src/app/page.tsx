import { LocaleProvider } from "@/i18n/LocaleProvider";
import Home from "@/components/Home";

export default function Page() {
  return (
    <LocaleProvider>
      <Home />
    </LocaleProvider>
  );
}
