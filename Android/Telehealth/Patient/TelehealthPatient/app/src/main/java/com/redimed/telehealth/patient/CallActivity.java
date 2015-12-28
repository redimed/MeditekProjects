package com.redimed.telehealth.patient;

import android.app.NotificationManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.hardware.Camera;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.SystemClock;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.content.LocalBroadcastManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.ViewFlipper;

import com.opentok.android.BaseVideoRenderer;
import com.opentok.android.Connection;
import com.opentok.android.OpentokError;
import com.opentok.android.Publisher;
import com.opentok.android.PublisherKit;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;
import com.opentok.android.SubscriberKit;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.BlurTransformation;
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

public class CallActivity extends AppCompatActivity implements View.OnClickListener, PublisherKit.PublisherListener, SubscriberKit.VideoListener, Session.SessionListener, Session.SignalListener {

    private Intent i;
    private String TAG = "CALL";
    private Publisher publisher;
    private Subscriber subscriber;
    private Session sessionOpenTok;
    private long startTime = 0L;
    private long updatedTime = 0L;
    private long timeSwapBuff = 0L;
    private boolean flagDestroy = false;
    private long timeInMilliseconds = 0L;
    private ArrayList<Stream> streamOpenTok;
    private Handler customHandler = new Handler();
    private static final String LOGTAG = "OpenTok";
    private String sessionId, token, apiKey, to, from;
    private static final boolean SUBSCRIBE_TO_SELF = false;

    @Bind(R.id.btnHold)
    Button btnHold;
    @Bind(R.id.btnEndCall)
    Button btnEndCall;
    @Bind(R.id.btnMutePub)
    Button btnMutePub;
    @Bind(R.id.btnMuteSub)
    Button btnMuteSub;
    @Bind(R.id.publisherView)
    RelativeLayout publisherView;
    @Bind(R.id.subscriberView)
    RelativeLayout subscriberView;
    @Bind(R.id.loadingSpinner)
    ProgressBar loadingBar;
    @Bind(R.id.lblNameDoctor)
    TextView lblNameDoctor;
    @Bind(R.id.lblTimer)
    TextView lblTimer;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);
        ButterKnife.bind(this);
        streamOpenTok = new ArrayList<Stream>();

        btnEndCall.setOnClickListener(this);
        btnHold.setOnClickListener(this);
        btnMutePub.setOnClickListener(this);
        btnMuteSub.setOnClickListener(this);

        ListenSocket();
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onStop() {
        super.onStop();
//        if (sessionOpenTok != null)
//            sessionOpenTok.disconnect();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (!flagDestroy) {
            sessionOpenTok.sendSignal("endCall", "end");
            publisher = null;
            subscriber = null;
            streamOpenTok.clear();
            sessionOpenTok.disconnect();
        }
        timeSwapBuff += timeInMilliseconds;
        customHandler.removeCallbacks(updateTimerThread);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
    }

    @Override
    public void onBackPressed() {
        return;
    }

    //Initialize Session ID, API Key, Token
    private void ListenSocket() {
        i = getIntent();
        if (i.getExtras() != null) {
            sessionId = i.getExtras().getString("sessionId");
            token = i.getExtras().getString("token");
            apiKey = i.getExtras().getString("apiKey");
            to = i.getExtras().getString("to");
            from = i.getExtras().getString("from");
            lblNameDoctor.setText(i.getExtras().getString("fromName") == null ? " " : i.getExtras().getString("fromName"));
            if (i.getExtras().getString("message").equals("answer")) {
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("from", from);
                params.put("to", to);
                params.put("message", "answer");
                try {
                    SocketService.sendData("socket/messageTransfer", params);
                    SessionConnect();
                } catch (Throwable throwable) {
                    throwable.printStackTrace();
                }
                if (!MyApplication.getInstance().IsMyServiceRunning(SocketService.class)) {
                    startService(new Intent(this, SocketService.class));
                }
            }
        }
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btnHold:
                HoldCommunication();
                break;
            case R.id.btnMutePub:
                MutePublisher();
                break;
            case R.id.btnMuteSub:
                MuteSubscriber();
                break;
            case R.id.btnEndCall:
                EndCommunication();
                break;
        }
    }

    private void EndCommunication() {
        sessionOpenTok.sendSignal("endCall", "end");
        publisher = null;
        subscriber = null;
        streamOpenTok.clear();
        sessionOpenTok.disconnect();
        flagDestroy = true;
        finish();
    }

    //Click button hold on a call
    private void HoldCommunication() {
        if (publisher.getPublishVideo()) {
            subscriber.setSubscribeToAudio(false);
            publisher.setPublishVideo(false);
        } else {
            subscriber.setSubscribeToAudio(true);
            publisher.setPublishVideo(true);
        }
    }

    //Click button mute sound when call
    private void MutePublisher() {
        publisher.setPublishAudio(!publisher.getPublishAudio());
        if (publisher.getPublishAudio()) {
            btnMutePub.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_unmute_icon, 0, 0, 0);
        } else {
            btnMutePub.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_mute_icon, 0, 0, 0);
        }
    }

    private void MuteSubscriber() {
        subscriber.setSubscribeToAudio(!subscriber.getSubscribeToAudio());
        if (subscriber.getSubscribeToAudio()) {
            btnMuteSub.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_speaker_icon, 0, 0, 0);
        } else {
            btnMuteSub.setCompoundDrawablesWithIntrinsicBounds(R.drawable.call_unspeaker_icon, 0, 0, 0);
        }
    }

    //Initialize session to make connect between application and Open Tok
    private void SessionConnect() {
        if (sessionOpenTok == null) {
            sessionOpenTok = new Session(CallActivity.this, apiKey, sessionId);
            sessionOpenTok.setSessionListener(this);
            sessionOpenTok.setSignalListener(this);
            sessionOpenTok.connect(token);

            startTime = SystemClock.uptimeMillis();
            customHandler.postDelayed(updateTimerThread, 0);
        }
    }

    @Override
    public void onSignalReceived(Session session, String type, String data, Connection connection) {
        Log.d(TAG, "onSignalReceived. Type: "+ type + " data: "+data);
        String myConnectionId = session.getConnection().getConnectionId();
        String theirConnectionId = connection.getConnectionId();
        if (!theirConnectionId.equals(myConnectionId)) {
            if (type.equalsIgnoreCase("endCall") && data.equalsIgnoreCase("end")) {
                publisher = null;
                subscriber = null;
                streamOpenTok.clear();
                sessionOpenTok.disconnect();
                finish();
            }
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
            lblTimer.setText(String.format("%02d", hours)
                    + ":" + String.format("%02d", min)
                    + ":" + String.format("%02d", secs));
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
        btnMutePub.setEnabled(true);
        btnMuteSub.setEnabled(true);
        btnHold.setEnabled(true);
        btnEndCall.setEnabled(true);
    }

    //Initialize view Subscriber (Clinic)
    public void AttachSubscriberView(Subscriber paramSubscriber) {
        RelativeLayout.LayoutParams layoutSubscriber = new RelativeLayout.LayoutParams(
                getResources().getDisplayMetrics().widthPixels,
                getResources().getDisplayMetrics().heightPixels);
        subscriberView.addView(subscriber.getView(), layoutSubscriber); // TODO: 12/22/2015  null
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
        if (sessionOpenTok != null)
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

    //Subscriber's Video is Disabled
    @Override
    public void onVideoDisabled(SubscriberKit subscriberKit, String s) {
        Log.d(TAG, subscriberKit.getView() + " ");
    }

    //Subscriber's Video is Re-enabled
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
