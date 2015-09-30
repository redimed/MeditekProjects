package com.redimed.telehealth.patient;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.Toast;
import android.widget.ViewFlipper;

import com.opentok.android.BaseVideoRenderer;
import com.opentok.android.OpentokError;
import com.opentok.android.Publisher;
import com.opentok.android.PublisherKit;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;
import com.opentok.android.SubscriberKit;
import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.redimed.telehealth.patient.utils.OpenTokConfig;
import com.squareup.picasso.Picasso;

import org.json.JSONException;
import org.json.JSONObject;

import com.redimed.telehealth.patient.service.SocketService;
import com.redimed.telehealth.patient.utils.BlurTransformation;
import com.redimed.telehealth.patient.utils.Config;
import com.squareup.picasso.Picasso;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import butterknife.Bind;
import butterknife.ButterKnife;
import io.socket.client.IO;

public class CallActivity extends AppCompatActivity implements View.OnClickListener, PublisherKit.PublisherListener, SubscriberKit.VideoListener, Session.SessionListener {

    private Intent i;
    private Session sessionOpenTok;
    private Publisher publisher;
    private Subscriber subscriber;
    private ArrayList<Stream> streamOpenTok;
    private static final String LOGTAG = "OpenTok";
    private String sessionId, token, apiKey, to, from;

    @Bind(R.id.fabHold)FloatingActionButton fabHold;
    @Bind(R.id.fabEndCall) FloatingActionButton fabEndCall;
    @Bind(R.id.fabMute) FloatingActionButton fabMute;

    @Bind(R.id.publisherView) RelativeLayout publisherView;
    @Bind(R.id.subscriberView) RelativeLayout subscriberView;
    @Bind(R.id.loadingSpinner) ProgressBar loadingBar;

    @Bind(R.id.imgLogoCall) ImageView imgLogoCall;
    @Bind(R.id.btnDecline) Button btnDecline;
    @Bind(R.id.btnAnswer) Button btnAnswer;
    @Bind(R.id.vfCall) ViewFlipper vfCall;

    private BroadcastReceiver receiverDataSocketService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);

        ButterKnife.bind(this);

        streamOpenTok = new ArrayList<Stream>();
        Picasso.with(getApplicationContext()).load(R.drawable.logo_bg_redimed)
                .transform(new BlurTransformation(getApplicationContext(), 15))
                .into(imgLogoCall);

        btnDecline.setOnClickListener(this);
        btnAnswer.setOnClickListener(this);
        fabEndCall.setOnClickListener(this);
        fabHold.setOnClickListener(this);
        fabMute.setOnClickListener(this);

        GetDataFromHome();
        SessionConnect();
        ListenSocket();
    }

    private void GetDataFromHome() {
        i = getIntent();
        if (i.getExtras() != null){
            sessionId = i.getExtras().getString("sessionId");
            token = i.getExtras().getString("token");
            apiKey = i.getExtras().getString("apiKey");
            to = i.getExtras().getString("to");
            from = i.getExtras().getString("from");
        }
    }

    @Override
    public void onBackPressed() {
        if (sessionOpenTok != null){
            EndCommunication();
        }
        super.onBackPressed();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case (R.id.btnDecline):
                BackHome();
                break;
            case (R.id.btnAnswer):
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

    private void AnswerCommunication() {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("from", from);
        params.put("to", to);
        params.put("message", "answer");
        params.put("sessionId", sessionId);
        try {
            SocketService.sendData("socket/messageTransfer", params);
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        vfCall.showNext();
        Intent i = new Intent(getApplicationContext(), VoiceActivity.class);
        startActivity(i);
    }

    private void BackHome() {
        Intent i = new Intent(getApplicationContext(), HomeActivity.class);
        startActivity(i);
        this.finish();
    }

    //Click button hold on a call
    private void HoldCommunication() {
        publisher.setPublishVideo(!publisher.getPublishVideo());
        if (publisher.getPublishVideo() == false){
            publisher.setPublishAudio(false);
            subscriber.setSubscribeToAudio(false);
        }else {
            publisher.setPublishAudio(true);
            publisher.setPublishAudio(true);
        }
    }

    //Click button mute sound when call
    private void MuteCommunication() {
        publisher.setPublishAudio(!publisher.getPublishAudio());
        fabMute.setImageResource(publisher.getPublishAudio() ? R.drawable.icon_unmute : R.drawable.icon_mute);
    }

    //Stop appointment
    private void EndCommunication() {
        publisher = null;
        subscriber = null;
        streamOpenTok.clear();
        sessionOpenTok.disconnect();
        i = new Intent(this, HomeActivity.class);
        startActivity(i);
        this.finish();
    }

    //Initialize session to make connect between application and Open Tok
    private void SessionConnect() {
        if (sessionOpenTok == null){
            sessionOpenTok = new Session(CallActivity.this, OpenTokConfig.API_KEY, OpenTokConfig.SESSION_ID);
            sessionOpenTok.setSessionListener(this);
            sessionOpenTok.connect(OpenTokConfig.TOKEN);
        }
    }

    //Initialize view Publisher (Patient)
    private void AttachPublisherView(Publisher paramPublisher) {
        publisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        RelativeLayout.LayoutParams layoutPublisher = new RelativeLayout.LayoutParams(500, 500);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_TOP, RelativeLayout.TRUE);
        layoutPublisher.addRule(RelativeLayout.ALIGN_PARENT_RIGHT, RelativeLayout.TRUE);
        layoutPublisher.topMargin = dpToPx(8);
        layoutPublisher.rightMargin = dpToPx(8);
        publisherView.addView(publisher.getView(), layoutPublisher);
    }

    //Initialize view Subscriber (Clinic)
    public void AttachSubscriberView(Subscriber paramSubscriber){
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
        if (subscriber.getSubscribeToVideo()){
            loadingBar.setVisibility(View.VISIBLE);
        }
    }

    //Disconnect with subscribe
    private void UnsubscribeFromStream(Stream stream) {
        streamOpenTok.remove(stream);
        if (subscriber.getStream().getStreamId().equals(stream.getStreamId())){
            subscriberView.removeView(subscriber.getView());
            subscriber = null;
            if (!streamOpenTok.isEmpty()){
                SubscribeToStream(streamOpenTok.get(0));
            }
        }
        EndCommunication();
    }

    @Override
    public void onConnected(Session session) {
        if (publisher == null){
            publisher = new Publisher(CallActivity.this, "publisher");
            publisher.setPublisherListener(this);
            AttachPublisherView(publisher);
            sessionOpenTok.publish(publisher);
        }
    }

    @Override
    public void onDisconnected(Session session) {
        if (publisher != null){
            publisherView.removeView(publisher.getView());
        }

        if (subscriber != null){
            subscriberView.removeView(subscriber.getView());
        }

        publisher = null;
        subscriber = null;
        streamOpenTok.clear();
        sessionOpenTok = null;
    }

    @Override
    public void onStreamCreated(PublisherKit publisherKit, Stream stream) {
        if (OpenTokConfig.SUBSCRIBE_TO_SELF){
            streamOpenTok.add(stream);
            if (subscriber == null){
                SubscribeToStream(stream);
            }
        }
    }

    @Override
    public void onStreamReceived(Session session, Stream stream) {
        if (!OpenTokConfig.SUBSCRIBE_TO_SELF) {
            streamOpenTok.add(stream);
            if (subscriber == null) {
                SubscribeToStream(stream);
            }
        }
    }

    @Override
    public void onStreamDropped(Session session, Stream stream) {
        if (!OpenTokConfig.SUBSCRIBE_TO_SELF) {
            if (subscriber != null) {
                UnsubscribeFromStream(stream);
            }
        }
    }

    @Override
    public void onStreamDestroyed(PublisherKit publisherKit, Stream stream) {
        if (OpenTokConfig.SUBSCRIBE_TO_SELF && subscriber != null){
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

    private void ListenSocket() {
        IntentFilter intentFilter = new IntentFilter("android.intent.action.MessageSocket");
        receiverDataSocketService = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                String message = "";
                String strSocket = intent.getStringExtra("Message");
                try {
                    JSONObject jsonSocket = new JSONObject(strSocket);
                    message = jsonSocket.get("message").toString();
                    if (message.equalsIgnoreCase("answer")){
                        SharedPreferences data = getApplicationContext().getSharedPreferences("Clinic", MODE_PRIVATE);
                        apiKey = data.getString("apiKey", null);
                        sessionId = data.getString("sessionId", null);
                        token = data.getString("token", null);
                        vfCall.showNext();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };
        this.registerReceiver(receiverDataSocketService, intentFilter);
    }

    @Override
    protected void onPause() {
        super.onPause();
        this.unregisterReceiver(this.receiverDataSocketService);
    }
}
