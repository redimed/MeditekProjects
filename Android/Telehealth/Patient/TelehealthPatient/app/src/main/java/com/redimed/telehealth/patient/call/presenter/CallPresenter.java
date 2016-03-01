package com.redimed.telehealth.patient.call.presenter;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.SystemClock;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.RelativeLayout;

import com.opentok.android.BaseVideoRenderer;
import com.opentok.android.Connection;
import com.opentok.android.OpentokError;
import com.opentok.android.Publisher;
import com.opentok.android.PublisherKit;
import com.opentok.android.Session;
import com.opentok.android.Stream;
import com.opentok.android.Subscriber;
import com.opentok.android.SubscriberKit;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.call.CallActivity;
import com.redimed.telehealth.patient.call.view.ICallView;
import com.redimed.telehealth.patient.service.SocketService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Fox on 1/21/2016.
 */
public class CallPresenter implements ICallPresenter, PublisherKit.PublisherListener, SubscriberKit.VideoListener, Session.SessionListener, Session.SignalListener {

    private Context context;
    private ICallView iCallView;

    private String sessionId, token, apiKey;
    private static final boolean SUBSCRIBE_TO_SELF = false;

    /* OpenTok */
    private Publisher publisher;
    private Subscriber subscriber;
    private Session sessionOpenTok;
    private ArrayList<Stream> streamOpenTok;

    /* Timer */
    private long startTime = 0L;
    private long updatedTime = 0L;
    private long timeSwapBuff = 0L;
    private long timeInMilliseconds = 0L;
    private Handler customHandler = new Handler();

    public CallPresenter(Context context, ICallView iCallView) {
        this.context = context;
        this.iCallView = iCallView;

        streamOpenTok = new ArrayList<Stream>();
    }

    @Override
    public void listenSocket(Intent i) {
        Bundle bundle = i.getExtras();
        if (bundle != null) {
            sessionId = bundle.getString("sessionId", "");
            token = bundle.getString("token", "");
            apiKey = bundle.getString("apiKey", "");
            iCallView.onLoadNameCaller(bundle.getString("fromName", ""));

            if (bundle.getString("message", "").equalsIgnoreCase("answer")) {
                Map<String, Object> params = new HashMap<String, Object>();
                params.put("from", bundle.getString("to", ""));
                params.put("to", bundle.getString("from", ""));
                params.put("message", "answer");
                try {
                    SocketService.sendData("socket/messageTransfer", params);
                    iCallView.onSocketSuccess();
                } catch (Throwable throwable) {
                    throwable.printStackTrace();
                }
            }
        }
    }

    @Override
    public void socketConnection() {
        if (sessionOpenTok == null) {
            sessionOpenTok = new Session(context, apiKey, sessionId);
            sessionOpenTok.setSessionListener(this);
            sessionOpenTok.setSignalListener(this);
            sessionOpenTok.connect(token);
        }
    }

    //Click button hold on a call
    @Override
    public void holdCommunication() {
        if (publisher.getPublishVideo()) {
            subscriber.setSubscribeToAudio(false);
            publisher.setPublishVideo(false);
        } else {
            subscriber.setSubscribeToAudio(true);
            publisher.setPublishVideo(true);
        }
    }

    //Click button mute sound when call
    @Override
    public void mutePublisher() {
        publisher.setPublishAudio(!publisher.getPublishAudio());
        if (publisher.getPublishAudio()) {
            iCallView.onMutePublisher(R.drawable.call_unmute_icon);
        } else {
            iCallView.onMutePublisher(R.drawable.call_mute_icon);
        }
    }

    @Override
    public void muteSubscriber() {
        subscriber.setSubscribeToAudio(!subscriber.getSubscribeToAudio());
        if (subscriber.getSubscribeToAudio()) {
            iCallView.onMuteSubscriber(R.drawable.call_speaker_icon);
        } else {
            iCallView.onMuteSubscriber(R.drawable.call_unspeaker_icon);
        }
    }

    @Override
    public void endCommunication() {
        sessionOpenTok.sendSignal("endCall", "end");
        publisher = null;
        subscriber = null;
        streamOpenTok.clear();
        sessionOpenTok.disconnect();
        iCallView.onEndCommunication();
    }

    private Runnable updateTimerThread = new Runnable() {
        String timer = "";
        public void run() {
            timeInMilliseconds = SystemClock.uptimeMillis() - startTime;
            updatedTime = timeSwapBuff + timeInMilliseconds;
            int secs = (int) (updatedTime / 1000) % 60;
            int min = (int) ((updatedTime / (1000 * 60)) % 60);
            int hours = (int) ((updatedTime / (1000 * 60 * 60)) % 24);
            secs = secs % 60;
            timer = String.format("%02d", hours) + ":" + String.format("%02d", min) + ":" + String.format("%02d", secs);
            iCallView.onLoadTimer(timer);
            customHandler.postDelayed(this, 0);
        }
    };

    @Override
    public void onConnected(Session session) {
        if (publisher == null) {
            publisher = new Publisher(context, "publisher");
            publisher.setPublisherListener(this);
            sessionOpenTok.publish(publisher);

            //View publisher
            publisher.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
            iCallView.onAttachPublisherView(publisher);
        }
    }

    @Override
    public void onDisconnected(Session session) {
        if (publisher != null) {
            iCallView.onRemoveView("publisher", publisher.getView());
        }

        if (subscriber != null) {
            iCallView.onRemoveView("subscriber", subscriber.getView());
        }
        publisher = null;
        subscriber = null;
        streamOpenTok.clear();
        if (sessionOpenTok != null)
            sessionOpenTok.disconnect();
    }

    //Initialize connect with subscriber
    private void SubscribeToStream(Stream stream) {
        subscriber = new Subscriber(context, stream);
        subscriber.setVideoListener(this);
        sessionOpenTok.subscribe(subscriber);
        if (subscriber.getSubscribeToVideo()) {
            iCallView.onLoadProgress(View.VISIBLE);
        }
    }

    //Disconnect with subscriber
    private void UnsubscribeFromStream(Stream stream) {
        streamOpenTok.remove(stream);
        if (subscriber.getStream().getStreamId().equals(stream.getStreamId())) {
            iCallView.onRemoveView("subscriber", subscriber.getView());
            subscriber = null;
            if (!streamOpenTok.isEmpty()) {
                SubscribeToStream(streamOpenTok.get(0));
            }
        }
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
    public void onStreamDestroyed(PublisherKit publisherKit, Stream stream) {
        if (SUBSCRIBE_TO_SELF && subscriber != null) {
            UnsubscribeFromStream(stream);
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
    public void onError(PublisherKit publisherKit, OpentokError opentokError) {

    }

    @Override
    public void onError(Session session, OpentokError opentokError) {

    }

    @Override
    public void onSignalReceived(Session session, String type, String data, Connection connection) {
        String myConnectionId = session.getConnection().getConnectionId();
        String theirConnectionId = connection.getConnectionId();

        if (!theirConnectionId.equals(myConnectionId)) {
            if (type.equalsIgnoreCase("endCall") && data.equalsIgnoreCase("end")) {
                publisher = null;
                subscriber = null;
                streamOpenTok.clear();
                sessionOpenTok.disconnect();
                iCallView.onEndCommunication();
            }
        }
    }

    @Override
    public void onVideoDataReceived(SubscriberKit subscriberKit) {
        Log.d("TAG", "Subscriber");
        iCallView.onLoadProgress(View.GONE);
        subscriber.setStyle(BaseVideoRenderer.STYLE_VIDEO_SCALE, BaseVideoRenderer.STYLE_VIDEO_FILL);
        iCallView.onAttachSubscriberView(subscriber);

        //Counter timer
        startTime = SystemClock.uptimeMillis();
        customHandler.postDelayed(updateTimerThread, 0);
    }

    //Subscriber's Video is Disabled
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
