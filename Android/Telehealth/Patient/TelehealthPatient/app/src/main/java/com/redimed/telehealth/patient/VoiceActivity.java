package com.redimed.telehealth.patient;

import android.content.Intent;
import android.support.design.widget.FloatingActionButton;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;

import com.opentok.android.BaseVideoRenderer;
import com.opentok.android.OpentokError;
import com.opentok.android.Publisher;
import com.opentok.android.PublisherKit;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;
import com.opentok.android.SubscriberKit;
import com.redimed.telehealth.patient.utils.OpenTokConfig;

import java.util.ArrayList;

import butterknife.Bind;
import butterknife.ButterKnife;

public class VoiceActivity extends AppCompatActivity implements View.OnClickListener, Session.SessionListener, PublisherKit.PublisherListener, SubscriberKit.VideoListener {

    private Intent i;
    private Session sessionOpenTok;
    private Publisher publisher;
    private Subscriber subscriber;
    private ArrayList<Stream> streamOpenTok;
    private static final String LOGTAG = "OpenTok";

    @Bind(R.id.fabHold) FloatingActionButton fabHold;
    @Bind(R.id.fabEndCall) FloatingActionButton fabEndCall;
    @Bind(R.id.fabMute) FloatingActionButton fabMute;

    @Bind(R.id.publisherView) RelativeLayout publisherView;
    @Bind(R.id.subscriberView) RelativeLayout subscriberView;
    @Bind(R.id.loadingSpinner) ProgressBar loadingBar;



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_voice);
        ButterKnife.bind(this);

        streamOpenTok = new ArrayList<Stream>();
        fabEndCall.setOnClickListener(this);
        fabHold.setOnClickListener(this);
        fabMute.setOnClickListener(this);

        SessionConnect();
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
    }

    //Initialize session to make connect between application and Open Tok
    private void SessionConnect() {
        if (sessionOpenTok == null){
            sessionOpenTok = new Session(VoiceActivity.this, OpenTokConfig.API_KEY, OpenTokConfig.SESSION_ID);
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
        subscriber = new Subscriber(VoiceActivity.this, stream);
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
    }

    @Override
    public void onConnected(Session session) {
        if (publisher == null){
            publisher = new Publisher(VoiceActivity.this, "publisher");
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
}
