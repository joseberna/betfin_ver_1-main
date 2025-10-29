import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import GlobalState from './global/GlobalState';
import ModalProvider from './modal/ModalProvider';
import WebSocketProvider from './websocket/WebsocketProvider';
import GameState from './game/GameState';

import  WalletProvider  from '../web3';
import theme from '../styles/theme';
import Normalize from '../styles/Normalize';
import GlobalStyles from '../styles/Global';

const Providers = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <WalletProvider>                           
        <GlobalState>
          <ModalProvider>
            <WebSocketProvider>
              <GameState>
                <Normalize />
                <GlobalStyles />
                {children}
              </GameState>
            </WebSocketProvider>
          </ModalProvider>
        </GlobalState>
      </WalletProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default Providers;
