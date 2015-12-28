package com.redimed.telehealth.patient;

import android.app.Activity;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import com.redimed.telehealth.patient.receiver.BootReceiver;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.redimed.telehealth.patient.utils.Config;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;
import com.squareup.picasso.UrlConnectionDownloader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.HashMap;
import java.util.Map;
import butterknife.Bind;
import butterknife.ButterKnife;

public class WaitingActivity extends AppCompatActivity implements View.OnClickListener {

    private static Intent i;
    private MediaPlayer ringtone;
    private static Context context;
    private boolean flagDestroy = false;
    private static String TAG = "WAITING";
    private SharedPreferences telehealthPatient;
    private NotificationManager notificationManager;
    private LocalBroadcastManager localBroadcastManager;
    private String sessionId, token, apiKey, to, from, fromName;

    @Bind(R.id.lblNameCaller)
    TextView lblNameCaller;
    @Bind(R.id.btnDecline)
    FloatingActionButton btnDecline;
    @Bind(R.id.btnAnswer)
    FloatingActionButton btnAnswer;
    @Bind(R.id.waitCallLayout)
    RelativeLayout waitCallLayout;
    @Bind(R.id.logo)
    ImageView logo;

    BootReceiver receiver = new BootReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equalsIgnoreCase("call.action.finish")) {
                finish();
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_waiting);
        context = this;
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);
        notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        telehealthPatient = getSharedPreferences("TelehealthUser", getApplicationContext().MODE_PRIVATE);
        ButterKnife.bind(this);
        Picasso.with(getApplicationContext()).load(R.drawable.logo_redimed).into(logo);

        localBroadcastManager = LocalBroadcastManager.getInstance(this);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("call.action.finish");
        localBroadcastManager.registerReceiver(receiver, intentFilter);

        btnDecline.setOnClickListener(this);
        btnAnswer.setOnClickListener(this);

        PlayingSound();
        ListenSocket();
    }

    private void PlayingSound() {
        StopPlaying();
        if (ringtone == null) {
            ringtone = MediaPlayer.create(this, R.raw.ringtone);
            ringtone.setAudioStreamType(AudioManager.STREAM_MUSIC);
            ringtone.setLooping(true);
            ringtone.start();
        }
    }

    private void StopPlaying() {
        if (ringtone != null && ringtone.isPlaying()) {
            ringtone.stop();
            ringtone.release();
            ringtone = null;
        }
    }

    private void ListenSocket() {
        i = getIntent();
        if (i.getExtras() != null) {
            if (i.getExtras().getString("message").equals("call")) {
                sessionId = i.getExtras().getString("sessionId");
                token = i.getExtras().getString("token");
                apiKey = i.getExtras().getString("apiKey");
                to = i.getExtras().getString("to");
                from = i.getExtras().getString("from");
                fromName = i.getExtras().getString("fromName") == null ? " " : i.getExtras().getString("fromName");
                lblNameCaller.setText(fromName);
                LoadImageCaller(Config.apiURLDownload + "test");
            }
        }
    }

    private void LoadImageCaller(String url) {
        Picasso picasso = new Picasso.Builder(getApplicationContext())
                .downloader(new UrlConnectionDownloader(getApplicationContext()) {
                    @Override
                    protected HttpURLConnection openConnection(Uri uri) throws IOException {
                        HttpURLConnection connection = super.openConnection(uri);
                        connection.addRequestProperty("Authorization", "Bearer " + telehealthPatient.getString("token", null));
                        connection.addRequestProperty("DeviceID", telehealthPatient.getString("deviceID", null));
                        connection.addRequestProperty("SystemType", "ARD");
                        connection.addRequestProperty("Cookie", telehealthPatient.getString("cookie", null));
                        connection.addRequestProperty("AppID", "com.redimed.telehealth.patient");
                        return connection;
                    }
                })
                .listener(new Picasso.Listener() {
                    @Override
                    public void onImageLoadFailed(Picasso picasso, Uri uri, Exception exception) {
                        Log.d("ERROR PICASSO", exception.getLocalizedMessage());
                    }
                }).build();

        picasso.with(this).load(url).transform(new BlurTransformation(getApplicationContext(), 15))
                .into(new Target() {
                    @Override
                    public void onBitmapLoaded(Bitmap bitmap, Picasso.LoadedFrom from) {
                        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN) {
                            waitCallLayout.setBackgroundDrawable(new BitmapDrawable(getApplicationContext().getResources(), bitmap));
                            waitCallLayout.invalidate();
                        } else {
                            waitCallLayout.setBackground(new BitmapDrawable(getApplicationContext().getResources(), bitmap));
                            waitCallLayout.invalidate();
                        }
                    }

                    @Override
                    public void onBitmapFailed(Drawable errorDrawable) {
                        waitCallLayout.setBackgroundResource(R.drawable.call_blank_avatar);
                    }

                    @Override
                    public void onPrepareLoad(Drawable placeHolderDrawable) {
//                        Log.d(TAG, "Prepare Load");
                    }
                });
    }

    //Accept appointment
    private void AnswerCommunication() {
        Intent i = new Intent(this, CallActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        i.putExtra("apiKey", apiKey);
        i.putExtra("sessionId", sessionId);
        i.putExtra("token", token);
        i.putExtra("to", to);
        i.putExtra("from", from);
        i.putExtra("message", "answer");
        i.putExtra("fromName", fromName);
        startActivity(i);
        flagDestroy = true;
        finish();
    }

    //Refuse appointment
    private void DeclineCommunication() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", from);
        params.put("to", to);
        params.put("message", "decline");
        try {
            SocketService.sendData("socket/messageTransfer", params);
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        flagDestroy = true;
        finish();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case (R.id.btnDecline):
                DeclineCommunication();
                break;
            case (R.id.btnAnswer):
                AnswerCommunication();
                break;
        }
    }

    @Override
    public void onBackPressed() {
        return;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        PlayingSound();

        WaitingActivity.onResumeAppTracking(this);
        WaitingActivity.setAppInBackgroundFalse();
    }

    @Override
    protected void onStop() {
        super.onStop();

        WaitingActivity.setAppInBackgroundTrue();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        StopPlaying();
        notificationManager.cancel(0);
        localBroadcastManager.unregisterReceiver(receiver);
        if (!flagDestroy) {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("from", from);
            params.put("to", to);
            params.put("message", "decline");
            try {
                SocketService.sendData("socket/messageTransfer", params);
            } catch (Throwable throwable) {
                throwable.printStackTrace();
            }
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        StopPlaying();

        WaitingActivity.setAppInBackgroundFalse();
    }

    private static boolean IS_APP_IN_BACKGROUND = false;

    protected static void onResumeAppTracking(Activity activity) {
        if (WaitingActivity.isAppInBackground()) {
            // do requirements for returning app to foreground
        }
    }

    protected static void setAppInBackgroundFalse() {
        IS_APP_IN_BACKGROUND = false;
    }

    protected static void setAppInBackgroundTrue() {
        IS_APP_IN_BACKGROUND = true;
    }

    protected static boolean isAppInBackground() {
        return IS_APP_IN_BACKGROUND;
    }
}
