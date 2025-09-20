package com.rada;

import io.undertow.Undertow;
import io.undertow.server.RoutingHandler;
import io.undertow.server.handlers.PathHandler;

public class MainServer {

    public static void main(String[] args) {
        RoutingHandler routes = new RoutingHandler();
        routes.get("/", exchange -> exchange.getResponseSender().send("Rada backend running"));
        routes.get("/health", exchange -> exchange.getResponseSender().send("OK"));

        PathHandler path = new PathHandler();
        path.addPrefixPath("/", routes);

        Undertow server = Undertow.builder()
                .addHttpListener(8080, "0.0.0.0")
                .setHandler(path)
                .build();
        server.start();
        System.out.println("Undertow server started on http://localhost:8080");
    }
}