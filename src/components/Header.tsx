
import { ThemeToggle } from "./ThemeProvider";

export default function Header() {
  return (
    <header className="py-4">
      <div className="container flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            AppointmentPro
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
