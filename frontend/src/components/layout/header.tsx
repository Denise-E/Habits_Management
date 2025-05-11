import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut, Menu, X, Users, GraduationCap, UserCircle, Music, HomeIcon, Building, TrophyIcon } from "lucide-react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const { user, logoutMutation } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const adminMenuItems = [
    { icon: <TrophyIcon className="h-5 w-5" />, label: "Inscripciones", href: "/tournaments" },
    { icon: <Music className="h-5 w-5" />, label: "Coreografías", href: "/admin/presentations" },
    { icon: <Building className="h-5 w-5" />, label: "Instituciones", href: "/admin/institutions" },
  ];

  const notAdminMenuItems = [
    { icon: <Users className="h-5 w-5" />, label: "Alumnos", href: "/students" },
    { icon: <GraduationCap className="h-5 w-5" />, label: "Profesores", href: "/professors" },
    { icon: <Music className="h-5 w-5" />, label: "Coreografías", href: "/presentations" },
  ];

  let menuItems = user?.typeId == 1 ? adminMenuItems : notAdminMenuItems

  const notAdminHamburguerMenuItems = [
    { icon: <HomeIcon className="h-5 w-5" />, label: "Inicio", href: "/" },
    { icon: <Users className="h-5 w-5" />, label: "Alumnos", href: "/students" },
    { icon: <GraduationCap className="h-5 w-5" />, label: "Profesores", href: "/professors" },
    { icon: <Music className="h-5 w-5" />, label: "Coreografías", href: "/presentations" },
    { icon: <UserCircle className="h-5 w-5" />, label: "Perfil", href: "/profile" },
  ];

  const adminHamburguerMenuItems = [
    { icon: <HomeIcon className="h-5 w-5" />, label: "Inicio", href: "/" },
    { icon: <TrophyIcon className="h-5 w-5" />, label: "Inscripciones", href: "/tournaments" },
    { icon: <Music className="h-5 w-5" />, label: "Coreografías", href: "/admin/presentations" },
    { icon: <Building className="h-5 w-5" />, label: "Instituciones", href: "/admin/institutions" },
    { icon: <UserCircle className="h-5 w-5" />, label: "Perfil", href: "/profile" }
  ];

  const HamburguerMenuItems = user?.typeId == 1 ? adminHamburguerMenuItems : notAdminHamburguerMenuItems

  return (
    <header className="flex justify-between items-center shadow-md p-4 px-6 md:px-12">

      {/* Mobile Menu Button - Ahora a la izquierda del logo */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mr-4"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Logo */}
      <div>
        <h1 className="text-lg sm:text-lg md:text-lg lg:text-2xl font-bold underline decoration-primary decoration-3 underline-offset-3 flex items-center">
          <Link to={"/"} className="flex items-center">
            <img src="/attached_assets/new_favicon1.jpeg" alt="Icono" className="hidden sm:block w-16 h-16 mr-1 rounded-full" />
            Campeonato Argentina Baila
          </Link>
        </h1>
      </div>


      {/* Desktop Menu con dos renglones en pantallas intermedias */}
      {!isMobile && (
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-lg md:max-w-[300px] md:gap-x-4 md:gap-y-1 lg:max-w-none lg:flex-nowrap">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href} className="hover:text-[#8223e3] transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Mobile Sidebar Menu - Ahora desde la izquierda */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 pt-6 p-4"
          >
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Menu Items */}
            <nav className="space-y-4">
              {HamburguerMenuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User & Logout */}
      <div className="ml-4 flex flex-col md:flex-col lg:flex-row items-center text-center md:text-left">
        {!isMobile && (
          <Button variant="link" size="lg" asChild className="text text-md">
            <Link to="/profile">Perfil</Link>
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="mt-1 md:mt-1 lg:mt-0"
        >
          {logoutMutation.isPending ? (
            <span>Cerrando sesión...</span>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </>
          )}
        </Button>
      </div>
    </header>
  );
}