import React, { useState, useEffect , useContext} from "react";
import { Menu, X, Zap } from "lucide-react";
import Button from "./Button";
import { NavItem } from "../../types";
import LoginDialog from "@/components/LoginDialog";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";

const NAV_ITEMS: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#" },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const context = useContext(UserDetailContext);
  if (!context) throw new Error("UserDetailContext must be used within UserDetailProvider");

  const { userDetail } = context;
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = (isOpen: boolean) => setOpenDialog(isOpen);

  useEffect(() => {
    if (userDetail?.name) {
      setOpenDialog(false);
      router.push("/workspace");
    }
  }, [userDetail]);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 py-4 transition-colors duration-300 ${
        isScrolled
          ? "bg-gray-950/90 backdrop-blur-md border-b border-gray-800 shadow-sm"
          : "bg-transparent"
      }`}
      // ensure this element itself has no transform
      style={{ transform: "none" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-brand-500 p-1.5 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Kinetic</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium text-gray-400 hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white" onClick={handleOpenDialog}>Sign In</a>
            <Button variant="primary" size="sm" onClick={handleOpenDialog}>Get Started</Button>
          </div>

          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-950 border-b border-gray-800 p-4">
          <div className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className="text-base font-medium text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <hr className="border-gray-800" />
            <a href="#" className="text-base font-medium text-gray-300 hover:text-white block" onClick={handleOpenDialog}>Sign In</a>
            <Button variant="primary" className="w-full" onClick={handleOpenDialog}>Get Started</Button>
          </div>
        </div>
      )}
      <LoginDialog openDialog={openDialog} closeDialog={handleCloseDialog} />
    </header>
  );
};

export default Header;
