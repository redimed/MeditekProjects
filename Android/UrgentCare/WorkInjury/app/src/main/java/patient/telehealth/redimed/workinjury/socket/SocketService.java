package patient.telehealth.redimed.workinjury.socket;

import android.annotation.SuppressLint;
import android.app.Service;
import android.content.Intent;
import android.net.Uri;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import io.socket.client.IO;
import io.socket.client.Manager;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import io.socket.engineio.client.Transport;
import patient.telehealth.redimed.workinjury.MyApplication;
import patient.telehealth.redimed.workinjury.utils.Config;
import patient.telehealth.redimed.workinjury.utils.Key;
import patient.telehealth.redimed.workinjury.waiting.WaitingActivity;

public class SocketService extends Service {

    private static String TAG = "SocketService ==============================> ";
    private static MyApplication application;

    public SocketService() {

    }

    private TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
        @SuppressLint("TrustAllX509TrustManager")
        @Override
        public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType)
                throws CertificateException {

        }

        @SuppressLint("TrustAllX509TrustManager")
        @Override
        public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType)
                throws CertificateException {

        }

        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
            return new java.security.cert.X509Certificate[]{};
        }
    }};

    public static class RelaxedHostNameVerifier implements HostnameVerifier {
        @SuppressLint("BadHostnameVerifier")
        public boolean verify(String hostname, SSLSession session) {
            return true;
        }
    }

    private static Socket socketTelehealth;
    {
        try {
            application = MyApplication.getInstance();

            String token = String.valueOf(application.getDataSharedPreferences(Key.token, Key.defalt));
            String deviceId = String.valueOf(application.getDataSharedPreferences(Key.deviceID, Key.defalt));

            SSLContext mySSLContext = SSLContext.getInstance("TLS");
            mySSLContext.init(null, trustAllCerts, new SecureRandom());

            IO.setDefaultSSLContext(mySSLContext);
            IO.setDefaultHostnameVerifier(new RelaxedHostNameVerifier());

            IO.Options opts = new IO.Options();
            opts.forceNew = true;
            opts.reconnection = true;
            opts.secure = true;
            opts.sslContext = mySSLContext;
            opts.hostnameVerifier = new RelaxedHostNameVerifier();
            opts.query = "__sails_io_sdk_version=0.12.3&Authorization=Bearer " + token + "&DeviceID=" + deviceId + "&SystemType=ARD";

            socketTelehealth = IO.socket(Config.Telehealth, opts);

        } catch (URISyntaxException e) {

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }
    }

    private Emitter.Listener onTransport = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d(TAG, "onTransport");
            Transport transport = (Transport)args[0];

            transport.on(Transport.EVENT_REQUEST_HEADERS, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    @SuppressWarnings("unchecked")
                    Map<String, List<String>> headers = (Map<String, List<String>>)args[0];
                    // modify request headers
                    headers.put("Cookie", Arrays.asList("foo=1;"));
                }
            });

            transport.on(Transport.EVENT_RESPONSE_HEADERS, new Emitter.Listener() {
                @Override
                public void call(Object... args) {
                    @SuppressWarnings("unchecked")
                    Map<String, List<String>> headers = (Map<String, List<String>>)args[0];
                    // access response headers
                    String cookie = headers.get("Set-Cookie").get(0);
                }
            });
        }
    };

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
            Log.d(TAG, Config.Telehealth + emitUrl);
            obj.put("url", emitUrl);
            socketTelehealth.emit("get", obj);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public static void JoinRoom() {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("uid", application.getDataSharedPreferences(Key.teleUid, Key.defalt));
            SocketService.sendData("socket/joinRoom", params);
        } catch (Throwable throwable) {
            Log.d(TAG, throwable.getLocalizedMessage());
        }
    }

    private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d(TAG, "onConnect");
            JoinRoom();
        }
    };

    private Emitter.Listener onReconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d(TAG, "onReconnect");
        }
    };

    private Emitter.Listener onDisconnect = new Emitter.Listener() {
        @Override
        public void call(Object... args) {
            Log.d(TAG, "onDisconnect");
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

            try {
                String message = data.get("message").toString();
                if (message.equalsIgnoreCase("call")) {
                    Intent i = new Intent(getApplicationContext(), WaitingActivity.class);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                    i.putExtra("apiKey", data.get("apiKey").toString());
                    i.putExtra("sessionId", data.get("sessionId").toString());
                    i.putExtra("token", data.get("token").toString());
                    i.putExtra("to", data.get("from").toString());
                    i.putExtra("from", String.valueOf(application.getDataSharedPreferences(Key.teleUid, Key.defalt)));
                    i.putExtra("message", data.get("message").toString());
                    i.putExtra("fromName", data.get("fromName").toString());
                    startActivity(i);
                }
                if (message.equalsIgnoreCase("cancel") || message.equalsIgnoreCase("decline")) {
                    LocalBroadcastManager localBroadcastManager = LocalBroadcastManager.getInstance(SocketService.this);
                    localBroadcastManager.sendBroadcast(new Intent("call.action.finish"));
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }

        }
    };

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        socketTelehealth.on(Socket.EVENT_CONNECT, onConnect);
        socketTelehealth.on(Socket.EVENT_DISCONNECT, onDisconnect);
        socketTelehealth.on(Socket.EVENT_RECONNECT, onReconnect);
        socketTelehealth.on(Socket.EVENT_ERROR, onError);
        socketTelehealth.on(Socket.EVENT_CONNECT_ERROR, onConnectError);
        socketTelehealth.on(Socket.EVENT_CONNECT_TIMEOUT, onConnectError);
        socketTelehealth.on("receiveMessage", onReceiveMessage);
        socketTelehealth.on("errorMsg", onReceiveError);
        socketTelehealth.on(Manager.EVENT_TRANSPORT, onTransport);
        return super.onStartCommand(intent, flags, startId);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "onCreate");
        socketTelehealth.connect();
    }
}
