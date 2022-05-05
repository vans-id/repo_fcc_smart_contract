import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material'
import Header from './components/Header';
import Main from './components/Main';

const AppContainer = styled(Box)(({ theme }) => `
  background: ${theme.palette.background.paper};
  min-height: 100vh;
  color: #fff;
`)

function App() {
  return (
    <AppContainer>
      <Container maxWidth="md">
        <Header />
        <Main />
      </Container>
    </AppContainer>
  );
}

export default App;
