import { useState } from "react";
import { Header } from "./header";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Users, GraduationCap, Presentation, UserCircle, Music, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "../ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const menuItems = [
    { icon: <Users className="h-5 w-5" />, label: "Alumnos", href: "/students" },
    { icon: <GraduationCap className="h-5 w-5" />, label: "Profesores", href: "/professors" },
    { icon: <Music className="h-5 w-5" />, label: "Coreografías", href: "/presentations" },
    { icon: <UserCircle className="h-5 w-5" />, label: "Perfil", href: "/profile" },
    { icon: <LogOut className="h-5 w-5" />, label: "Cerrar sesión", href: "/logout" },
  ];



  // Find the active menu item's label based on the current location
  const activeMenuItem = menuItems.find(item => item.href === location);
  const activeLabel = activeMenuItem ? activeMenuItem.label : "Sistema de Coreografías"; // Default title

  return (
    <div className="min-h-screen bg-background">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} activeLabel={activeLabel} />
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 pt-16"
          >
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.href} className="flex">
                  {item.label === "Cerrar sesión" ? (
                    <button
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      {logoutMutation.isPending ? (
                        <span>Cerrando sesión...</span>
                      ) : (
                        <>
                          {item.icon}
                          <span>{item.label}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link href={item.href} className="w-full">
                      <a className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors w-full">
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={cn(
        "pt-16 px-4 transition-all duration-300",
        isMenuOpen && "md:pl-64"
      )}>
        <div className="max-w-7xl mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
}