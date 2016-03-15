package com.redimed.telehealth.patient.service;

import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.redimed.telehealth.patient.network.Config;
import com.redimed.telehealth.patient.waiting.WaitingActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import javax.security.cert.X509Certificate;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * Created by luann on 9/23/2015.
 */
public class SocketService extends Service {

    private static Socket socket;
    private static SharedPreferences uidTelehealth;
    private static String TAG = "=====SocketService=====";

    private void initializeSocket() {
        uidTelehealth = getSharedPreferences("TelehealthUser", MODE_PRIVATE);
        String auth = uidTelehealth.getString("token", null);
        String deviceId = uidTelehealth.getString("deviceId", null);
        try {
            SSLContext sc = null;
            sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new SecureRandom());

            HttpsURLConnection.setDefaultHostnameVerifier(new RelaxedHostNameVerifier());

            IO.setDefaultSSLContext(sc);
            IO.Options opts = new IO.Options();
            opts.secure = true;
            opts.forceNew = true;
            opts.sslContext = sc;
            opts.reconnection = true;
            opts.query = "__sails_io_sdk_version=0.11.0&Authorization=Bearer " + auth + "&DeviceID=" + deviceId + "&SystemType=Android";
            socket = IO.socket(Config.socketURL, opts);
            socket.connect();
        } catch (URISyntaxException | NoSuchAlgorithmException | KeyManagementException e) {
            e.printStackTrace();
        }
    }

    private TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
        @Override
        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType)
                throws CertificateException {

        }

        @Override
        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType)
                throws CertificateException {

        }

        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
            return new java.security.cert.X509Certificate[]{};
        }
    }};

    public static class RelaxedHostNameVerifier implements HostnameVerifier {
        public boolean verify(String hostname, SSLSession session) {
            return true;
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
        return START_STICKY;
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

    //Receive Socket Message
    private Emitter.Listener onReceiveMessage = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            JSONObject data = (JSONObject) args[0];
            NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            try {
                String message = data.get("message").toString();
                if (message.equalsIgnoreCase("call")) {
                    Intent i = new Intent(getApplicationContext(), WaitingActivity.class);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                    i.putExtra("apiKey", data.get("apiKey").toString());
                    i.putExtra("sessionId", data.get("sessionId").toString());
                    i.putExtra("token", data.get("token").toString());
                    i.putExtra("to", data.get("from").toString());
                    i.putExtra("from", uidTelehealth.getString("uid", null));
                    i.putExtra("message", data.get("message").toString());
                    i.putExtra("fromName", data.get("fromName").toString());
                    startActivity(i);
                }
                if (message.equalsIgnoreCase("cancel") || message.equalsIgnoreCase("decline")) {
                    LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(SocketService.this);
                    localBroadcastManager.sendBroadcast(new Intent("call.action.finish"));
                    notificationManager.cancel(0);
                }
                Log.d(TAG, message);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
    };

    public static void closeSockets() {
        if (socket != null) {
            try {
                socket.close();
                socket.disconnect();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        closeSockets();
    }
}
