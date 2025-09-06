import { Layout } from '@/components/Layout';
import { ToastContainer } from '@/components/ui/toast';
import { useToast } from '@/hooks/useToast';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Layout />
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

export default App;
