package com.rada;

import io.undertow.Handlers;
import io.undertow.Undertow;
import io.undertow.websockets.WebSocketProtocolHandshakeHandler;
import io.undertow.websockets.core.AbstractReceiveListener;
import io.undertow.websockets.core.BufferedTextMessage;
import io.undertow.websockets.core.WebSocketChannel;
import io.undertow.websockets.spi.WebSocketHttpExchange;

import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

public class WsServer {
    private static final Set<WebSocketChannel> clients = new CopyOnWriteArraySet<>();

    public static void start() {
        WebSocketProtocolHandshakeHandler wsHandler = Handlers.websocket(new io.undertow.websockets.WebSocketConnectionCallback() {
            @Override
            public void onConnect(WebSocketHttpExchange exchange, WebSocketChannel channel) {
                clients.add(channel);
                channel.getReceiveSetter().set(new AbstractReceiveListener() {
                    @Override
                    protected void onFullTextMessage(WebSocketChannel channel, BufferedTextMessage message) {
                        String msg = message.getData();
                        broadcast("ECHO: " + msg);
                    }
                });
                channel.resumeReceives();
            }
        });

        Undertow server = Undertow.builder()
                .addHttpListener(8081, "0.0.0.0")
                .setHandler(wsHandler)
                .build();
        server.start();
        System.out.println("WebSocket server started on ws://localhost:8081");
    }

    private static void broadcast(String message) {
        for (WebSocketChannel c : clients) {
            try {
                io.undertow.websockets.core.WebSockets.sendText(message, c, null);
            } catch (Exception e) {
                // ignore in skeleton
            }
        }
    }
}