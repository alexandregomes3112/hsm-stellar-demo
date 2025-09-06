import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Wallet, Github, Menu, X, ExternalLink, Sparkles, Zap } from 'lucide-react';
import { HsmAdmin } from '@/pages/HsmAdmin';
import { StellarSigner } from '@/pages/StellarSigner';

export function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('hsm');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3" />
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-success/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 w-full glass border-b border-white/10 safe-top"
      >
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo Section */}
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="relative">
              <Shield className="h-7 w-7 text-primary relative z-10" />
              <div className="absolute inset-0 h-7 w-7 bg-primary/20 rounded-full blur-sm animate-pulse-soft" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold gradient-text-stellar">HSM Stellar</h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="hidden sm:inline-flex text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20">
                  <Zap className="h-3 w-3 mr-1" />
                  Testnet
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <motion.a
              href="https://github.com/stellar/stellar-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center gap-2 px-3 py-2 rounded-md hover:bg-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="h-4 w-4" />
              Documentação
            </motion.a>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 p-2 rounded-md hover:bg-white/5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="h-5 w-5" />
            </motion.a>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-md hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/10 glass-strong"
            >
              <nav className="container max-w-7xl mx-auto flex flex-col gap-1 py-4 px-4">
                <motion.a
                  href="https://github.com/stellar/stellar-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 px-3 py-3 rounded-md hover:bg-white/5"
                  whileHover={{ x: 4 }}
                >
                  <ExternalLink className="h-4 w-4" />
                  Documentação
                </motion.a>
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3 px-3 py-3 rounded-md hover:bg-white/5"
                  whileHover={{ x: 4 }}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </motion.a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative pt-8 pb-6"
      >
        <div className="container max-w-4xl mx-auto text-center px-4">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
              Demonstração HSM DINAMO + Stellar
            </Badge>
            <Sparkles className="h-5 w-5 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text-stellar">
            Integração Segura de Criptografia
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Gerencie usuários, crie chaves criptográficas e assine transações Stellar usando Hardware Security Module (HSM) DINAMO
          </p>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 glass border-white/20 p-1">
                <TabsTrigger 
                  value="hsm" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin</span>
                  <span className="sm:hidden">HSM</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="stellar" 
                  className="flex items-center gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">Assinador</span>
                  <span className="sm:hidden">Stellar</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <TabsContent value="hsm" className="focus:outline-none">
                <motion.div
                  key="hsm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HsmAdmin />
                </motion.div>
              </TabsContent>

              <TabsContent value="stellar" className="focus:outline-none">
                <motion.div
                  key="stellar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StellarSigner />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>

      {/* Enhanced Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-auto border-t border-white/10 glass py-8 text-center text-sm text-muted-foreground relative z-10 safe-bottom"
      >
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium">HSM Stellar Demo</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <span className="text-xs">Integração HSM DINAMO com Stellar</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span>Desenvolvido com</span>
              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                TailwindCSS v4
              </Badge>
              <span>+</span>
              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                React 19
              </Badge>
              <span>+</span>
              <Badge variant="outline" className="px-2 py-0.5 text-xs">
                NestJS
              </Badge>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
