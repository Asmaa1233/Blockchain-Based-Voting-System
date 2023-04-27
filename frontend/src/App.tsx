
import { BrowserRouter } from "react-router-dom";
import Footer from "./components/Footer";
import AuthProvider from "./contexts/Auth";
import CustomRoutes from "./components/CustomRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div>
        <CustomRoutes />      
         <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
