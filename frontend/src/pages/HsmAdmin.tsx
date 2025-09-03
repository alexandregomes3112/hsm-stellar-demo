import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useHsm } from '@/hooks/useHsm';
import { Key, User, Copy, Eye, EyeOff, Shield, Lock, CheckCircle2, Sparkles, Zap } from 'lucide-react';

const HSM_PERMISSIONS = ['LIST', 'READ', 'CREATE', 'DELETE', 'UPDATE', 'REPLICATE'];

export function HsmAdmin() {
  // User creation state
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'LIST',
    'READ',
    'CREATE',
  ]);
  const [createdUserId, setCreatedUserId] = useState('');

  // Key creation state
  const [keyName, setKeyName] = useState('');
  const [keyUserId, setKeyUserId] = useState('');
  const [exportable, setExportable] = useState(false);
  const [temporary, setTemporary] = useState(false);
  const [createdKeyId, setCreatedKeyId] = useState('');

  // Public key state
  const [keyIdForPublic, setKeyIdForPublic] = useState('');
  const [publicKeyData, setPublicKeyData] = useState<{
    publicKey: string;
    publicKeyG: string;
  } | null>(null);

  const { createUser, createKey, getPublicKey, loading, error, clearError } = useHsm();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const result = await createUser({
        userId,
        password,
        permissions: selectedPermissions,
      });

      if (result.success) {
        setCreatedUserId(userId);
        // Clear form
        setUserId('');
        setPassword('');
      }
    } catch (err) {
      console.error(err);
      // Error is already handled in the hook
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const result = await createKey({
        keyName,
        algorithm: 'ALG_EC_ED25519',
        exp: exportable,
        temp: temporary,
        userId: keyUserId || createdUserId,
      });

      if (result.success) {
        setCreatedKeyId(keyName);
        // Clear form
        setKeyName('');
        setExportable(false);
        setTemporary(false);
      }
    } catch (err) {
      // Error is already handled in the hook
      console.error(err);
    }
  };

  const handleGetPublicKey = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const result = await getPublicKey(keyIdForPublic || createdKeyId);
      setPublicKeyData({
        publicKey: result.publicKey,
        publicKeyG: result.publicKeyG,
      });
    } catch (err) {
      console.error(err);
      // Error is already handled in the hook
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission],
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <Shield className="h-8 w-8 text-primary relative z-10" />
            <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-sm animate-pulse-soft" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text-stellar">
            Administração HSM
          </h1>
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
          Gerencie usuários, crie chaves criptográficas e controle permissões no HSM DINAMO com segurança máxima
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Lock className="h-3 w-3 mr-1" />
            Hardware Security Module
          </Badge>
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <Zap className="h-3 w-3 mr-1" />
            ED25519
          </Badge>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive" className="glass border-destructive/20">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Create User */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="relative">
                <User className="h-5 w-5 text-primary" />
                <div className="absolute inset-0 h-5 w-5 bg-primary/20 rounded-full blur-sm animate-pulse" />
              </div>
              Criar Usuário/Partição
            </CardTitle>
            <CardDescription>
              Crie um novo usuário no HSM com permissões específicas para operações criptográficas
            </CardDescription>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleCreateUser} className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='userId'>ID do Usuário</Label>
                <Input
                  id='userId'
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  placeholder='user_001'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Senha</Label>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder='••••••••'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Permissões</Label>
              <div className='flex flex-wrap gap-2'>
                {HSM_PERMISSIONS.map(permission => (
                  <Badge
                    key={permission}
                    variant={selectedPermissions.includes(permission) ? 'default' : 'outline'}
                    className='cursor-pointer'
                    onClick={() => togglePermission(permission)}
                  >
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              loading={loading}
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto"
            >
              <User className="h-4 w-4 mr-2" />
              {loading ? 'Criando Usuário...' : 'Criar Usuário'}
            </Button>

            {createdUserId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-success/20 bg-success/5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success-foreground">
                    Usuário <strong className="text-success">{createdUserId}</strong> criado com sucesso! 🎉
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
      </motion.div>

      {/* Create Key */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <Key className="h-5 w-5 text-primary" />
              <div className="absolute inset-0 h-5 w-5 bg-primary/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            Criar Chave ED25519
          </CardTitle>
          <CardDescription>
            Gere uma nova chave criptográfica ED25519 para assinatura segura de transações Stellar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateKey} className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='keyName'>Nome da Chave</Label>
                <Input
                  id='keyName'
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  placeholder='stellar_key_001'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='keyUserId'>ID do Usuário</Label>
                <Input
                  id='keyUserId'
                  value={keyUserId || createdUserId}
                  onChange={e => setKeyUserId(e.target.value)}
                  placeholder={createdUserId || 'user_001'}
                  required
                />
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={exportable}
                  onChange={e => setExportable(e.target.checked)}
                  className='rounded border-input'
                />
                <span className='text-sm'>Exportável</span>
              </label>

              <label className='flex items-center gap-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={temporary}
                  onChange={e => setTemporary(e.target.checked)}
                  className='rounded border-input'
                />
                <span className='text-sm'>Temporária</span>
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              loading={loading}
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Key className="h-4 w-4 mr-2" />
              {loading ? 'Criando Chave...' : 'Criar Chave'}
            </Button>

            {createdKeyId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-success/20 bg-success/5">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success-foreground">
                    Chave <strong className="text-success">{createdKeyId}</strong> criada com sucesso! 🔑
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
      </motion.div>

      {/* Get Public Key */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="relative">
              <Key className="h-5 w-5 text-primary" />
              <div className="absolute inset-0 h-5 w-5 bg-primary/20 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            Obter Chave Pública
          </CardTitle>
          <CardDescription>
            Recupere a chave pública no formato Stellar (G...) para verificação e validação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGetPublicKey} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='keyIdForPublic'>ID da Chave</Label>
              <Input
                id='keyIdForPublic'
                value={keyIdForPublic || createdKeyId}
                onChange={e => setKeyIdForPublic(e.target.value)}
                placeholder={createdKeyId || 'stellar_key_001'}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              loading={loading}
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Key className="h-4 w-4 mr-2" />
              {loading ? 'Recuperando...' : 'Obter Chave Pública'}
            </Button>

            {publicKeyData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 mt-6"
              >
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Chave Pública (Base64)
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      value={publicKeyData.publicKey} 
                      readOnly 
                      className="font-mono text-xs bg-muted/50" 
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(publicKeyData.publicKey)}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    Chave Pública Stellar (G...)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={publicKeyData.publicKeyG}
                      readOnly
                      className="font-mono text-xs bg-muted/50"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(publicKeyData.publicKeyG)}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
