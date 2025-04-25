import { useState, useEffect } from "react";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const navLinks = [{
    name: "Home",
    href: "#home"
  }, {
    name: "About",
    href: "#about"
  }, {
    name: "Gallery",
    href: "#gallery"
  }, {
    name: "Membership",
    href: "#membership"
  }, {
    name: "Trainers",
    href: "#trainers"
  }, {
    name: "Testimonials",
    href: "#testimonials"
  }, {
    name: "Contact",
    href: "#contact"
  }];

  // Group the navigation links into three categories
  const navCategories = [{
    title: "Discover",
    items: [{
      name: "Home",
      href: "#home"
    }, {
      name: "About",
      href: "#about"
    }, {
      name: "Gallery",
      href: "#gallery"
    }]
  }, {
    title: "Services",
    items: [{
      name: "Membership",
      href: "#membership"
    }, {
      name: "Trainers",
      href: "#trainers"
    }]
  }, {
    title: "Connect",
    items: [{
      name: "Testimonials",
      href: "#testimonials"
    }, {
      name: "Contact",
      href: "#contact"
    }]
  }];
  return <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-gym-black shadow-lg py-2" : "bg-transparent py-4"}`}>
      <div className="gym-container flex justify-between items-center">
        <a href="#home" className="flex items-center">
          <span className="text-2xl md:text-3xl font-impact text-gym-yellow">MUSCLE GARAAGE</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navCategories.map(category => <NavigationMenuItem key={category.title}>
                  <NavigationMenuTrigger className="bg-transparent text-white hover:text-gym-yellow hover:bg-transparent">
                    {category.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4 bg-gym-gray-800 rounded-md">
                      {category.items.map(item => <li key={item.name}>
                          <NavigationMenuLink asChild>
                            <a href={item.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gym-gray-700 hover:text-gym-yellow">
                              <div className="text-sm font-medium">{item.name}</div>
                            </a>
                          </NavigationMenuLink>
                        </li>)}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>)}
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-3">
            
            
            <a href="#membership" className="btn btn-primary">
              Join Now
            </a>
            
            <a href="/login" className="flex items-center gap-2 px-4 py-2 bg-gym-gray-800 hover:bg-gym-gray-700 text-white rounded-md transition-colors duration-300">
              <User size={18} />
              <span>Login</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Button variant="outline" className="border-gym-yellow text-gym-yellow hover:bg-gym-yellow hover:text-gym-black relative" size="sm" onClick={() => window.location.href = "/cart"}>
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>}
          </Button>
          
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && <div className="absolute top-full left-0 right-0 bg-gym-black shadow-lg md:hidden">
            <div className="flex flex-col p-4 space-y-3">
              {navLinks.map(link => <a key={link.name} href={link.href} className="text-white hover:text-gym-yellow transition-colors duration-300 py-2 px-4" onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </a>)}
              <a href="#membership" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                Join Now
              </a>
              <a href="/login" className="flex items-center gap-2 px-4 py-2 bg-gym-gray-800 hover:bg-gym-gray-700 text-white rounded-md" onClick={() => setIsMenuOpen(false)}>
                <User size={18} />
                <span>Login</span>
              </a>
            </div>
          </div>}
      </div>
    </header>;
};
export default Navbar;