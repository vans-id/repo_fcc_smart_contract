import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';
import Header from './containers/Header';
import Main from './containers/Main';

const AppContainer = styled(Box)(
  ({ theme }) => `
  background: #F2F4F6;
  min-height: 100vh;
  padding-bottom: 40vh;
`
);

function App() {
  return (
    <AppContainer>
      <Header />
      <Container maxWidth='sm'>
        <Main />
      </Container>
    </AppContainer>
  );
}

export default App;
