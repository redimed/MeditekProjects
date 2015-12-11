package com.redimed.telehealth.patient;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.SystemClock;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.ViewFlipper;

import com.opentok.android.BaseVideoRenderer;
import com.opentok.android.OpentokError;
import com.opentok.android.Publisher;
import com.opentok.android.PublisherKit;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;
import com.opentok.android.SubscriberKit;
import com.redimed.telehealth.patient.receiver.BootReceiver;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.redimed.telehealth.patient.utils.Config;
import com.squareup.picasso.Picasso;
import com.squareup.picasso.Target;
import com.squareup.picasso.UrlConnectionDownloader;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import butterknife.Bind;
import butterknife.ButterKnife;

public class CallActivity extends AppCompatActivity implements View.OnClickListener, PublisherKit.PublisherListener, SubscriberKit.VideoListener, Session.SessionListener {

    private Intent i;
    private String TAG = "CALL";
    private long startTime = 0L;
    private Publisher publisher;
    private MediaPlayer ringtone;
    private Subscriber subscriber;
    private Session sessionOpenTok;
    private long updatedTime = 0L;
    private long timeSwapBuff = 0L;
    private long timeInMilliseconds = 0L;
    private ArrayList<Stream> streamOpenTok;
    private SharedPreferences telehealthPatient;
    private Handler customHandler = new Handler();
    private static final String LOGTAG = "OpenTok";
    private String sessionId, token, apiKey, to, from;
    private LocalBroadcastManager localBroadcastManager;
    private static final boolean SUBSCRIBE_TO_SELF = false;

    @Bind(R.id.fabHold)
    Button fabHold;
    @Bind(R.id.fabEndCall)
    FloatingActionButton fabEndCall;
    @Bind(R.id.fabMute)
    Button fabMute;
    @Bind(R.id.publisherView)
    RelativeLayout publisherView;
    @Bind(R.id.subscriberView)
    RelativeLayout subscriberView;
    @Bind(R.id.loadingSpinner)
    ProgressBar loadingBar;
    @Bind(R.id.btnDecline)
    FloatingActionButton btnDecline;
    @Bind(R.id.btnAnswer)
    FloatingActionButton btnAnswer;
    @Bind(R.id.vfCall)
    ViewFlipper vfCall;
    @Bind(R.id.lblNameCaller)
    TextView lblNameCaller;
    @Bind(R.id.waitCallLayout)
    RelativeLayout waitCallLayout;
    @Bind(R.id.logo)
    ImageView logo;
    @Bind(R.id.lblNameDoctor)
    TextView lblNameDoctor;
    @Bind(R.id.lblTimer)
    TextView lblTimer;

    BootReceiver receiver = new BootReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (intent.getAction().equals("call.action.cancel")) {
                DeclineCommunication("cancel");
            } else if (intent.getAction().equals("call.action.end")) {
                EndCommunication();
            }
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);
        ButterKnife.bind(this);

        localBroadcastManager = LocalBroadcastManager.getInstance(this);
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("call.action.cancel");
        intentFilter.addAction("call.action.end");
        localBroadcastManager.registerReceiver(receiver, intentFilter);

        telehealthPatient = getSharedPreferences("TelehealthUser", getApplicationContext().MODE_PRIVATE);
        streamOpenTok = new ArrayList<Stream>();

        btnDecline.setOnClickListener(this);
        btnAnswer.setOnClickListener(this);
        fabEndCall.setOnClickListener(this);
        fabHold.setOnClickListener(this);
        fabMute.setOnClickListener(this);

        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        notificationManager.cancel(0);

        Picasso.with(getApplicationContext()).load(R.drawable.logo_redimed).into(logo);

        ListenSocket();
    }

    @Override
    protected void onStart() {
        Log.d(TAG, "CALL START");
        super.onStart();
    }

    @Override
    protected void onResume() {
        Log.d(TAG, "CALL RESUME");
        super.onResume();
    }

    @Override
    protected void onPause() {
        Log.d(TAG, "CALL PAUSE");
        super.onPause();
    }

    @Override
    protected void onStop() {
        Log.d(TAG, "CALL STOP");
        super.onStop();
        this.finish();
        if (sessionOpenTok != null)
            sessionOpenTok.disconnect();
    }

    @Override
    protected void onDestroy() {
        Log.d(TAG, "CALL DESTROY");
        super.onDestroy();
        localBroadcastManager.unregisterReceiver(receiver);
        customHandler.removeCallbacks(updateTimerThread);
        startTime = 0L;
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_HOME) {
            Log.d("Test", "Back button pressed!");
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }

    private void stopPlaying() {
        if (ringtone != null) {
            if (ringtone.isPlaying()) {
                ringtone.stop();
                ringtone.release();
                ringtone = null;
            }
        }
    }

    @Override
    public void onBackPressed() {
        return;
    }

    //    Initialize Session ID, API Key, Token
    private void ListenSocket() {
        i = getIntent();
        if (i.getExtras() != null) {
            if (i.getExtras().getString("message").equals("call")) {
                ringtone = MediaPlayer.create(this, R.raw.ringtone);
                if (ringtone.isPlaying()) {
                    stopPlaying();
                } else {
                    ringtone.setLooping(true);
                    ringtone.start();
                }
                sessionId = i.getExtras().getString("sessionId");
                token = i.getExtras().getString("token");
                apiKey = i.getExtras().getString("apiKey");
                to = i.getExtras().getString("to");
                from = i.getExtras().getString("from");
                lblNameCaller.setText(i.getExtras().getString("fromName") == null ? " " : i.getExtras().getString("fromName"));
                lblNameDoctor.setText(i.getExtras().getString("fromName") == null ? " " : i.getExtras().getString("fromName"));
                LoadImageCaller(Config.apiURLDownload + "test");
                if (!MyApplication.getInstance().IsMyServiceRunning(SocketService.class)) {
                    startService(new Intent(this, SocketService.class));
                }
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

        picasso.with(getApplicationContext()).load(url).transform(new BlurTransformation(getApplicationContext(), 15))
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
                        Log.d(TAG, "Prepare Load");
                    }
                });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case (R.id.btnDecline):
                DeclineCommunication("decline");
                break;
            case (R.id.btnAnswer):
                stopPlaying();
                AnswerCommunication();
                break;
            case R.id.fabHold:
                HoldCommunication();
                break;
            case R.id.fabMute:
                MuteCommunication();
                break;
            case R.id.fabEndCall:
                EndCommunication();
                break;
        }
    }

    //    Accept appointment
    private void AnswerCommunication() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", from);
        params.put("to", to);
        params.put("message", "answer");
        try {
            SocketService.sendData("socket/messageTransfer", params);
            SessionConnect();
            vfCall.showNext();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
    }

    private void EndCommunication() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", from);
        params.put("to", to);
        params.put("message", "end");
        try {
            SocketService.sendData("socket/messageTransfer", params);
            publisher = null;
            subscriber = null;
            streamOpenTok.clear();
            sessionOpenTok.disconnect();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        this.finish();
    }

    //    Refuse appointment
    private void DeclineCommunication(String message) {
        stopPlaying();
        if (message.equalsIgnoreCase("decline")) {
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("from", from);
            params.put("to", to);
            params.put("message", message);
            try {
                SocketService.sendData("socket/messageTransfer", params);
                publisher = null;
                subscriber = null;
                streamOpenTok.clear();
            } catch (Throwable throwable) {
                throwable.printStackTrace();
            }
        } else {
            publisher = null;
            subscriber = null;
            streamOpenTok.clear();
        }
        this.finish();
    }

    //Click button hold on a call
    private void HoldCommunication() {
        if (publisher.getPublishVideo() == true) {
//            publisher.setPublishAudio(false);
            subscriber.setSubscribeToAudio(false);
            publisher.setPublishVideo(false);
        } else {
//            publisher.setPublishAudio(true);
            subscriber.setSubscribeToAudio(true);
            publisher.setPublishVideo(true);
        }
    }

    //Click button mute sound when call
    private void MuteCommunication() {
        publisher.setPublishAudio(!publisher.getPublishAudio());
        if (publisher.getPublishAudio()){
            fabMute.setCompoundDrawablesWithIntrinsicBounds(R.drawable.icon_unmute, 0, 0, 0);
        }else {
            fabMute.setCompoundDrawablesWithIntrinsicBounds(R.drawable.icon_mute, 0, 0, 0);
        }
    }

    //Initialize session to make connect between application and Open Tok
    private void SessionConnect() {
        if (sessionOpenTok == null) {
            sessionOpenTok = new Session(CallActivity.this, apiKey, sessionId);
            sessionOpenTok.setSessionListener(this);
            sessionOpenTok.connect(token);
            customHandler.postDelayed(updateTimerThread, 0);
        }
    }

    private Runnable updateTimerThread = new Runnable() {
        public void run() {
            timeInMilliseconds = SystemClock.uptimeMillis() - startTime;
            updatedTime = timeSwapBuff + timeInMilliseconds;
            int secs = (int) (updatedTime / 1000) % 60;
            int min = (int) ((updatedTime / (1000 * 60)) % 60);
            int hours = (int) ((updatedTime / (1000 * 60 * 60)) % 24);
            secs = secs % 60;
            int milliseconds = (int) (updatedTime % 1000);
            lblTimer.setText("" + min + ":" + String.format("%02d", secs));
            customHandler.postDelayed(this, 0);
        }
    };


    //Initialize view Publisher (Patient)
    private void AttachPublisherView(Publisher paramPublisher) {
        publisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        RelativeLayout.LayoutParams layoutPublisher = new RelativeLayout.LayoutParams(500, 500);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        layoutPublisher.topMargin = dpToPx(8);
        layoutPublisher.rightMargin = dpToPx(8);
        publisherView.addView(publisher.getView(), layoutPublisher);
        fabMute.setEnabled(true);
        fabHold.setEnabled(true);
    }

    //Initialize view Subscriber (Clinic)
    public void AttachSubscriberView(Subscriber paramSubscriber) {
        RelativeLayout.LayoutParams layoutSubscriber = new RelativeLayout.LayoutParams(
                getResources().getDisplayMetrics().widthPixels,
                getResources().getDisplayMetrics().heightPixels);
        subscriberView.addView(subscriber.getView(), layoutSubscriber);
        paramSubscriber.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
    }

    //Initialize connect with subscribe
    private void SubscribeToStream(Stream stream) {
        subscriber = new Subscriber(CallActivity.this, stream);
        subscriber.setVideoListener(this);
        sessionOpenTok.subscribe(subscriber);
        if (subscriber.getSubscribeToVideo()) {
            loadingBar.setVisibility(View.VISIBLE);
        }
    }

    //Disconnect with subscribe
    private void UnsubscribeFromStream(Stream stream) {
        streamOpenTok.remove(stream);
        if (subscriber.getStream().getStreamId().equals(stream.getStreamId())) {
            subscriberView.removeView(subscriber.getView());
            subscriber = null;
            if (!streamOpenTok.isEmpty()) {
                SubscribeToStream(streamOpenTok.get(0));
            }
        }
    }

    @Override
    public void onConnected(Session session) {
        if (publisher == null) {
            publisher = new Publisher(CallActivity.this, "publisher");
            publisher.setPublisherListener(this);
            AttachPublisherView(publisher);
            sessionOpenTok.publish(publisher);
            fabMute.setVisibility(View.VISIBLE);
            fabHold.setVisibility(View.VISIBLE);
        }
    }

    @Override
    public void onDisconnected(Session session) {
        if (publisher != null) {
            publisherView.removeView(publisher.getView());
        }

        if (subscriber != null) {
            subscriberView.removeView(subscriber.getView());
        }

        publisher = null;
        subscriber = null;
        streamOpenTok.clear();
        sessionOpenTok.disconnect();
    }

    @Override
    public void onStreamCreated(PublisherKit publisherKit, Stream stream) {
        if (SUBSCRIBE_TO_SELF) {
            streamOpenTok.add(stream);
            if (subscriber == null) {
                SubscribeToStream(stream);
            }
        }
    }

    @Override
    public void onStreamReceived(Session session, Stream stream) {
        if (!SUBSCRIBE_TO_SELF) {
            streamOpenTok.add(stream);
            if (subscriber == null) {
                SubscribeToStream(stream);
            }
        }
    }

    @Override
    public void onStreamDropped(Session session, Stream stream) {
        if (!SUBSCRIBE_TO_SELF) {
            if (subscriber != null) {
                UnsubscribeFromStream(stream);
            }
        }
    }

    @Override
    public void onStreamDestroyed(PublisherKit publisherKit, Stream stream) {
        if (SUBSCRIBE_TO_SELF && subscriber != null) {
            UnsubscribeFromStream(stream);
        }
    }

    @Override
    public void onError(Session session, OpentokError opentokError) {
        Log.i(LOGTAG, "Session exception: " + opentokError.getMessage());
    }


    @Override
    public void onError(PublisherKit publisherKit, OpentokError opentokError) {
        Log.i(LOGTAG, "Publisher exception: " + opentokError.getMessage());
    }

    /**
     * Converts dp to real pixels, according to the screen density.
     *
     * @param dp A number of density-independent pixels.
     * @return The equivalent number of real pixels.
     */
    private int dpToPx(int dp) {
        double screenDensity = this.getResources().getDisplayMetrics().density;
        return (int) (screenDensity * (double) dp);
    }

    @Override
    public void onVideoDataReceived(SubscriberKit subscriberKit) {
        loadingBar.setVisibility(View.GONE);
        AttachSubscriberView(subscriber);
    }

    @Override
    public void onVideoDisabled(SubscriberKit subscriberKit, String s) {

    }

    @Override
    public void onVideoEnabled(SubscriberKit subscriberKit, String s) {

    }

    @Override
    public void onVideoDisableWarning(SubscriberKit subscriberKit) {

    }

    @Override
    public void onVideoDisableWarningLifted(SubscriberKit subscriberKit) {

    }
}
