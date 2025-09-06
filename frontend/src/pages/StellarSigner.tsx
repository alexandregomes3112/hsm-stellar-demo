import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useStellar } from '@/hooks/useStellar';
import { useHsm } from '@/hooks/useHsm';
import { stellarService } from '@/services/stellar.service';
import {
  Send,
  Key,
  Info,
  AlertCircle,
  CheckCircle2,
  Copy,
  Wallet,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export function StellarSigner() {
  // Transaction state
  const [sourceAccount, setSourceAccount] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('100');
  const [memo, setMemo] = useState('');
  const [keyId, setKeyId] = useState('');

  // Account info state
  const [sourceAccountInfo, setSourceAccountInfo] = useState<any>(null);
  const [loadingAccountInfo, setLoadingAccountInfo] = useState(false);

  // Transaction flow state
  const [transactionXdr, setTransactionXdr] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [signedXdr, setSignedXdr] = useState('');
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  const {
    buildTransaction,
    submitTransaction,
    getAccountInfo,
    validatePublicKey,
    loading: stellarLoading,
    error: stellarError,
    clearError: clearStellarError,
  } = useStellar();

  const { loading: hsmLoading, error: hsmError, clearError: clearHsmError } = useHsm();

  const loading = stellarLoading || hsmLoading;
  const error = stellarError || hsmError;

  // Validate source account and load info
  useEffect(() => {
    if (sourceAccount && validatePublicKey(sourceAccount)) {
      loadAccountInfo();
    } else {
      setSourceAccountInfo(null);
    }
  }, [sourceAccount]);

  const loadAccountInfo = async () => {
    if (!sourceAccount || !validatePublicKey(sourceAccount)) return;

    setLoadingAccountInfo(true);
    try {
      const info = await getAccountInfo(sourceAccount);
      setSourceAccountInfo(info);
    } catch (err) {
      setSourceAccountInfo(null);
    } finally {
      setLoadingAccountInfo(false);
    }
  };

  const handleBuildAndSign = async (e: React.FormEvent) => {
    e.preventDefault();
    clearStellarError();
    clearHsmError();

    // Reset states
    setTransactionXdr('');
    setTransactionHash('');
    setSignedXdr('');
    setSubmissionResult(null);

    try {
      // Step 1: Build transaction
      const txResult = await buildTransaction({
        sourceAccountId: sourceAccount,
        destinationAccountId: destinationAccount,
        amount,
        fee,
        memo,
      });

      const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(txResult.hash)));
      setTransactionXdr(txResult.xdr);
      setTransactionHash(hashBase64);

      // Step 2: Sign with HSM
      const signature = await stellarService.signTransaction({
        keyId,
        txHashBase64: hashBase64,
      });

      // Step 3: Add signature to transaction
      const signedTx = await stellarService.addSignatureToTransaction(
        txResult.xdr,
        sourceAccount,
        signature.signatureBase64,
      );

      setSignedXdr(signedTx.signedXdr);
    } catch (err) {
      // Errors are handled by hooks
    }
  };

  const handleSubmitTransaction = async () => {
    if (!signedXdr) return;

    clearStellarError();

    try {
      const result = await submitTransaction(signedXdr);
      setSubmissionResult(result);
    } catch (err) {
      // Error is handled by hook
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getNativeBalance = () => {
    if (!sourceAccountInfo?.balances) return '0';
    const native = sourceAccountInfo.balances.find((b: any) => b.asset_type === 'native');
    return native?.balance || '0';
  };

  return (
    <div className='container max-w-4xl mx-auto py-8 px-4 space-y-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Assinador Stellar</h1>
        <p className='text-muted-foreground'>Crie e assine transações Stellar usando o HSM</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Transaction Form */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Send className='h-5 w-5' />
            Criar Transação de Pagamento
          </CardTitle>
          <CardDescription>Configure os detalhes da transação Stellar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBuildAndSign} className='space-y-4'>
            {/* Source Account */}
            <div className='space-y-2'>
              <Label htmlFor='sourceAccount'>Conta de Origem (G...)</Label>
              <Input
                id='sourceAccount'
                value={sourceAccount}
                onChange={e => setSourceAccount(e.target.value)}
                placeholder='GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
                className='font-mono text-xs'
                required
              />
              {sourceAccount && !validatePublicKey(sourceAccount) && (
                <p className='text-sm text-destructive'>Endereço inválido</p>
              )}
              {loadingAccountInfo && (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Loader2 className='h-3 w-3 animate-spin' />
                  Carregando informações da conta...
                </div>
              )}
              {sourceAccountInfo && (
                <div className='mt-2 p-3 bg-muted rounded-md space-y-1'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Saldo:</span>
                    <span className='font-mono font-medium'>{getNativeBalance()} XLM</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Sequência:</span>
                    <span className='font-mono'>{sourceAccountInfo.sequence}</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Signatários:</span>
                    <span>{sourceAccountInfo.signers.length}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Destination Account */}
            <div className='space-y-2'>
              <Label htmlFor='destinationAccount'>Conta de Destino (G...)</Label>
              <Input
                id='destinationAccount'
                value={destinationAccount}
                onChange={e => setDestinationAccount(e.target.value)}
                placeholder='GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
                className='font-mono text-xs'
                required
              />
              {destinationAccount && !validatePublicKey(destinationAccount) && (
                <p className='text-sm text-destructive'>Endereço inválido</p>
              )}
            </div>

            {/* Amount and Fee */}
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='amount'>Quantidade (XLM)</Label>
                <Input
                  id='amount'
                  type='number'
                  step='0.0000001'
                  min='0.0000001'
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder='10.0'
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='fee'>Taxa (stroops)</Label>
                <Input
                  id='fee'
                  type='number'
                  min='100'
                  value={fee}
                  onChange={e => setFee(e.target.value)}
                  placeholder='100'
                  required
                />
                <p className='text-xs text-muted-foreground'>1 XLM = 10,000,000 stroops</p>
              </div>
            </div>

            {/* Memo (optional) */}
            <div className='space-y-2'>
              <Label htmlFor='memo'>Memo (opcional)</Label>
              <Input
                id='memo'
                value={memo}
                onChange={e => setMemo(e.target.value)}
                placeholder='Pagamento de teste'
                maxLength={28}
              />
            </div>

            {/* HSM Key ID */}
            <div className='space-y-2'>
              <Label htmlFor='keyId'>ID da Chave HSM</Label>
              <Input
                id='keyId'
                value={keyId}
                onChange={e => setKeyId(e.target.value)}
                placeholder='stellar_key_001'
                required
              />
              <p className='text-xs text-muted-foreground'>
                A chave deve corresponder ao endereço de origem ou ser um signatário autorizado
              </p>
            </div>

            <Button
              type='submit'
              disabled={loading || !sourceAccountInfo}
              className='w-full sm:w-auto'
            >
              {loading ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Processando...
                </>
              ) : (
                <>
                  <Key className='h-4 w-4 mr-2' />
                  Construir e Assinar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Transaction XDR */}
      {transactionXdr && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Info className='h-5 w-5' />
              Transação Construída
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Hash da Transação (Base64)</Label>
              <div className='flex gap-2'>
                <Input value={transactionHash} readOnly className='font-mono text-xs' />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => copyToClipboard(transactionHash)}
                >
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label>XDR da Transação (sem assinatura)</Label>
              <div className='flex gap-2'>
                <Textarea value={transactionXdr} readOnly className='font-mono text-xs h-24' />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => copyToClipboard(transactionXdr)}
                >
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signed Transaction */}
      {signedXdr && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CheckCircle2 className='h-5 w-5 text-success' />
              Transação Assinada
            </CardTitle>
            <CardDescription>A transação foi assinada com sucesso pelo HSM</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>XDR Assinado</Label>
              <div className='flex gap-2'>
                <Textarea value={signedXdr} readOnly className='font-mono text-xs h-24' />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => copyToClipboard(signedXdr)}
                >
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <Alert>
              <Info className='h-4 w-4' />
              <AlertDescription>
                A transação está pronta para ser enviada à rede Stellar. Clique em "Enviar
                Transação" para submeter ao Horizon.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleSubmitTransaction}
              disabled={loading}
              className='w-full sm:w-auto'
            >
              {loading ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className='h-4 w-4 mr-2' />
                  Enviar Transação
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Submission Result */}
      {submissionResult && (
        <Card className='border-success'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-success'>
              <CheckCircle2 className='h-5 w-5' />
              Transação Enviada com Sucesso!
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Hash da Transação</Label>
              <div className='flex gap-2'>
                <Input value={submissionResult.hash} readOnly className='font-mono text-xs' />
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => copyToClipboard(submissionResult.hash)}
                >
                  <Copy className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Wallet className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>
                De: {sourceAccount.slice(0, 8)}...{sourceAccount.slice(-8)}
              </span>
              <ArrowRight className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>
                Para: {destinationAccount.slice(0, 8)}...{destinationAccount.slice(-8)}
              </span>
            </div>

            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-success'>
                {amount} XLM transferidos
              </Badge>
              {memo && <Badge variant='outline'>Memo: {memo}</Badge>}
            </div>

            <Alert>
              <CheckCircle2 className='h-4 w-4' />
              <AlertDescription>
                A transação foi confirmada na rede Stellar Testnet. Você pode verificar o status no
                explorador de blocos.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
