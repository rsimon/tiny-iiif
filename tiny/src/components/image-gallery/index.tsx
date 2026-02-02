import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ImageGallery } from './image-gallery';

const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <ImageGallery />
    </QueryClientProvider>
  );
}

export default App;