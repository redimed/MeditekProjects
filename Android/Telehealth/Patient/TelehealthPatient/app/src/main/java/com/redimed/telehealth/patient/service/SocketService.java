package com.redimed.telehealth.patient.service;

import android.app.Service;
import android.content.Intent;
import android.net.Uri;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.util.Log;

import com.redimed.telehealth.patient.utils.Config;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.Map;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by luann on 9/23/2015.
 */
public class SocketService extends Service {

    private static String TAG = "SocketService";
    private static Socket socket;
    private Intent i;

    static {
        initializeSocket();
    }

    private static void initializeSocket() {
        try {
            IO.Options opts = new IO.Options();
            opts.forceNew = true;
            opts.reconnection = true;
            socket = IO.socket(Config.socketURL, opts);
            socket.connect();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        socket.on("receiveMessage", onReceiveMessage);
        socket.on(Socket.EVENT_CONNECT, onConnect);
        socket.on(Socket.EVENT_DISCONNECT, onDisconnect);
        socket.on(Socket.EVENT_RECONNECT, onReconnect);
        socket.on(Socket.EVENT_ERROR, onError);
        socket.on(Socket.EVENT_CONNECT_ERROR, onConnectError);
        return START_STICKY;
    }

    public static void sendData(String url, Map<String, Object> params) throws Throwable {
        JSONObject obj = new JSONObject();
        try {
            Uri.Builder builder = new Uri.Builder();
            builder.appendPath("telehealth");
            builder.appendPath(url);
            for (String key : params.keySet()) {
                builder.appendQueryParameter(key, String.valueOf(params.get(key)));
            }
            String emitUrl = builder.build().toString();
            emitUrl = emitUrl.replaceAll("(?i)%2F", "/");
            Log.d(TAG, Config.socketURL + emitUrl);
            obj.put("url", emitUrl);
            socket.emit("get", obj);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
           Log.d(TAG, "====Socket Connected====");
        }
    };

    private Emitter.Listener onReconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d(TAG, "====Socket Reconnected====");
        }
    };

    private Emitter.Listener onDisconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d(TAG, "====Socket Disconnect====");
        }
    };

    private Emitter.Listener onError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d("Socket Error", args[0].toString());
        }
    };

    private Emitter.Listener onConnectError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d("Socket Connect Error", args[0].toString());
        }
    };

    private Emitter.Listener onReceiveMessage = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            JSONObject data = (JSONObject) args[0];
            i = new Intent("android.intent.action.MessageSocket").putExtra("Message", data.toString());
            getApplicationContext().sendBroadcast(i);
            Log.d("Socket Receive Message", data.toString());
        }
    };
}
