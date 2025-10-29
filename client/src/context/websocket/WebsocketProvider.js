import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import SocketContext from "./socketContext";
import { io } from "socket.io-client"; 
import { useNavigate } from "react-router-dom";

import {
  CS_DISCONNECT,
  CS_FETCH_LOBBY_INFO,
  SC_PLAYERS_UPDATED,
  SC_RECEIVE_LOBBY_INFO,
  SC_TABLES_UPDATED,
} from "../../pokergame/actions";

import globalContext from "../global/globalContext";
import config from "../../clientConfig";

/**
 * Conecta a ws://localhost:7777 por defecto (config.socketURI),
 * usa solo 'websocket' (sin long-polling) y path '/socket.io' (debe coincidir con el backend).
 * Incluye reconexión, limpieza y logs de diagnóstico.
 */
const WebSocketProvider = ({ children }) => {
  const { setTables, setPlayers, setChipsAmount } = useContext(globalContext);
  const navigate = useNavigate();

  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  // guardamos instancia en ref para limpiar listeners correctamente
  const socketRef = useRef(null);

  // --- helpers de limpieza ---
  const detachListeners = useCallback((s) => {
    if (!s) return;
    s.off("connect");
    s.off(SC_RECEIVE_LOBBY_INFO);
    s.off(SC_PLAYERS_UPDATED);
    s.off(SC_TABLES_UPDATED);
    s.off("connect_error");
    s.off("reconnect_attempt");
    s.off("reconnect");
    s.off("disconnect");
  }, []);

  const cleanUp = useCallback(() => {
    const s = socketRef.current;
    if (!s) return;

    try {
      s.emit?.(CS_DISCONNECT);
    } catch (_) {}

    detachListeners(s);
    // cerrar la conexión (no autoconnect)
    s.disconnect();
    socketRef.current = null;

    setSocket(null);
    setSocketId(null);
    setPlayers(null);
    setTables(null);

    // opcional: navegar fuera de áreas que dependan de socket
    // navigate("/connect");
  }, [detachListeners, setPlayers, setTables]);

  // --- conexión (una sola vez) ---
  useEffect(() => {
    // crea instancia si no existe
    if (!socketRef.current) {
      const s = io(config.socketURI, {
        path: "/socket.io",
        transports: ["websocket"],
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        timeout: 20000,
      });

      // listeners base
      s.on("connect", () => {
        console.log("🟢 WS connected:", s.id);
        setSocket(s);
        setSocketId(s.id);
      });

      s.on("connect_error", (err) => {
        console.warn("⚠️ WS connect_error:", err?.message || err);
      });

      s.on("reconnect_attempt", (n) => {
        console.log("🔁 WS reconnect_attempt:", n);
      });

      s.on("reconnect", (n) => {
        console.log("✅ WS reconnected:", n, "id:", s.id);
        setSocketId(s.id);
      });

      s.on("disconnect", (reason) => {
        console.log("🔴 WS disconnected:", reason);
      });

      // eventos de juego
      s.on(SC_RECEIVE_LOBBY_INFO, ({ tables, players, socketId: sid, amount }) => {
        console.log("SC_RECEIVE_LOBBY_INFO", { tables, players, sid, amount });
        setSocketId(sid || s.id);
        setChipsAmount?.(amount);
        setTables?.(tables);
        setPlayers?.(players);
      });

      s.on(SC_PLAYERS_UPDATED, (players) => {
        console.log("SC_PLAYERS_UPDATED", players);
        setPlayers?.(players);
      });

      s.on(SC_TABLES_UPDATED, (tables) => {
        console.log("SC_TABLES_UPDATED", tables);
        setTables?.(tables);
      });

      socketRef.current = s;
    }

    // cleanup al desmontar
    return () => cleanUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // opcional: exponer una acción para pedir lobby
  const fetchLobby = useCallback(
    ({ walletAddress, gameId, username }) => {
      const s = socketRef.current;
      if (!s || !s.connected) return;
      console.log("➡️ CS_FETCH_LOBBY_INFO", { walletAddress, gameId, username, socketId: s.id });
      s.emit(CS_FETCH_LOBBY_INFO, {
        walletAddress,
        socketId: s.id,
        gameId,
        username,
      });
    },
    []
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        socketId,
        cleanUp,     // para desconectar manualmente desde otras vistas
        fetchLobby,  // helper para entrar al lobby
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default WebSocketProvider;
