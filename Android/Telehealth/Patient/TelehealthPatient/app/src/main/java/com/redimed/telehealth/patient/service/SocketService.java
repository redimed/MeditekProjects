package com.redimed.telehealth.patient.service;

import android.app.Service;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.*;
import android.net.Uri;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.redimed.telehealth.patient.CallActivity;
import com.redimed.telehealth.patient.MainActivity;
import com.redimed.telehealth.patient.ModelActivity;
import com.redimed.telehealth.patient.utils.Config;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.util.HashMap;
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
    private static SharedPreferences uidTelehealth;
    private String auth, deviceId;
    private LocalBroadcastManager localBroadcastManager;

    private void initializeSocket() {
        uidTelehealth = getSharedPreferences("TelehealthUser", MODE_PRIVATE);
        auth = uidTelehealth.getString("token", null);
        deviceId = uidTelehealth.getString("deviceId", null);
        try {
            IO.Options opts = new IO.Options();
            opts.forceNew = true;
            opts.reconnection = true;
            opts.query = "__sails_io_sdk_version=0.11.0&Authorization=Bearer " + auth + "&DeviceID=" + deviceId + "&SystemType=Android";
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
        initializeSocket();
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        socket.on(Socket.EVENT_CONNECT, onConnect);
        socket.on(Socket.EVENT_DISCONNECT, onDisconnect);
        socket.on(Socket.EVENT_RECONNECT, onReconnect);
        socket.on(Socket.EVENT_ERROR, onError);
        socket.on(Socket.EVENT_CONNECT_ERROR, onConnectError);
        socket.on("receiveMessage", onReceiveMessage);
        socket.on("errorMsg", onReceiveError);
//        return START_STICKY;
        return START_NOT_STICKY;
    }

    public static void sendData(String url, Map<String, Object> params) throws Throwable {
        JSONObject obj = new JSONObject();
        try {
            Uri.Builder builder = new Uri.Builder();
            builder.appendPath("api/telehealth");
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

    public static void JoinRoom() {
        try {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("uid", uidTelehealth.getString("uid", null));
            SocketService.sendData("socket/joinRoom", params);
            Log.d(TAG, params.toString());
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d(TAG, "====Socket Connected====");
            JoinRoom();
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

    private Emitter.Listener onReceiveError = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d("Socket errorMsg", args[0].toString());
        }
    };

    private Emitter.Listener onReceiveMessage = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            JSONObject data = (JSONObject) args[0];
            try {
                String message = data.get("message").toString();
                if (message.equalsIgnoreCase("call")) {
                    i = new Intent(getApplicationContext(), CallActivity.class);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    i.putExtra("apiKey", data.get("apiKey").toString());
                    i.putExtra("sessionId", data.get("sessionId").toString());
                    i.putExtra("token", data.get("token").toString());
                    i.putExtra("to", data.get("from").toString());
                    i.putExtra("from", uidTelehealth.getString("uid", null));
                    i.putExtra("message", data.get("message").toString());
                    i.putExtra("fromName", data.get("fromName").toString());
                    startActivity(i);
                }
                if (message.equalsIgnoreCase("cancel")) {
                    localBroadcastManager = LocalBroadcastManager.getInstance(SocketService.this);
                    localBroadcastManager.sendBroadcast(new Intent("call.action.cancel"));
                }
                if (message.equalsIgnoreCase("end")) {
                    localBroadcastManager = LocalBroadcastManager.getInstance(SocketService.this);
                    localBroadcastManager.sendBroadcast(new Intent("call.action.end"));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    };

    public void onDestroy() {
        super.onDestroy();
        sendBroadcast(new Intent("Restart_Socket_Service"));
    }
}
