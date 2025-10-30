// client/src/components/loading/LoadingScreen.js
import React from 'react';
import styled from 'styled-components';
import Loader from './Loader';
import loadingImage from './../../assets/game/loading-background.jpg'
import { HeaderConnectWallet } from '../header/HeaderConnectWallet';

const HEADER_H = 64; // px

const Page = styled.div`
  /* ocupa toda la pantalla incluyendo móviles (teclado, notch) */
  min-height: 100dvh;
  width: 100%;
  background: #000;
`;

const Hero = styled.main`
  /* deja espacio para el header fijo */
  padding-top: ${HEADER_H}px;
  min-height: calc(100dvh - ${HEADER_H}px);

  /* imagen a pantalla completa */
  background-image: url(${loadingImage});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  /* overlay sutil para contraste */
  position: relative;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0.05), rgba(0,0,0,0.55));
    pointer-events: none;
  }

  display: grid;
  place-items: center;
`;

const Card = styled.div`
  position: relative; /* por encima del overlay */
  z-index: 1;
  background: rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(4px);
  border-radius: 14px;
  padding: 18px 22px;
  color: #e9fef9;
  box-shadow: 0 10px 30px rgba(0,0,0,.35);
`;

const LoadingScreen = () => (
  <Page>
    <HeaderConnectWallet />
    <Hero>
      <Card>
        <Loader />
      </Card>
    </Hero>
  </Page>
);

export default LoadingScreen;
